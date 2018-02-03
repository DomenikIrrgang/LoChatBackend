import { BackendModule } from "./BackendModule";
import { config } from "../config/Config";
import { LogLevel } from "../logging/LogLevel";
import { Express, Request, Response } from "express";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import { Database } from "../database/Database";

/**
 * The Backend class holds all references to all modules of the backend application and is
 * responsible for handling all server related functionalities.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class Backend {

    /**
     * Returns the singleton instance of the backend.
     *
     * @returns Singleton instance of Backend.
     */
    public static getInstance(): Backend {
        if (!Backend.backend) {
            Backend.backend = new Backend();
        }
        return Backend.backend;
    }

    /**
     * Only instance of Backend that can exist.
     */
    private static backend: Backend;

    /**
     * All modules that are loaded.
     */
    private modules: BackendModule[] = [];

    /**
     * Number of modules that have been loaded.
     */
    private modulesLoaded: number = 0;

    /**
     * Exrpess instance.
     */
    private express: Express;

    private constructor() { }

    /**
     * Initializes and starts the server.
     */
    public init(): void {
        config.app.logger.log(LogLevel.INFO, "Backend is running in " + config.environment + " mode.");
        config.app.logger.log(LogLevel.INFO, "Starting initialization...");
        Database.getInstance().init()
            .then(() => {
                this.initExpress();
                this.loadAllModules();
            })
            .catch(() => {
                config.app.logger.log(LogLevel.INFO, "Database could not be initialized. Shuting down...");
            });
    }

    private loadAllModules(): void {
        if (this.modules.length !== 0) {
            config.app.logger.log(LogLevel.INFO, "Loading modules...");
            for (let mod of this.modules) {
                mod.init(this.onModuleLoaded);
            }
        } else {
            this.startServer();
        }
    }

    private onModuleLoaded(module: BackendModule): void {
        config.app.logger.log(LogLevel.INFO,
            "Loaded module: " + module.getName() + ". " + this.modulesLoaded++ + "/" + this.modules.length + " modules loaded.");
        if (this.modulesLoaded === this.modules.length) {
            config.app.logger.log(LogLevel.INFO, "All modules loaded.");
            this.startServer();
        }
    }

    private initExpress(): void {
        config.app.logger.log(LogLevel.INFO, "Initializing Express...");
        this.express = express();
        this.express.use(cookieParser());
        this.express.use(bodyParser.json());
    }

    private startServer(): void {
        this.express.listen(config.app.port, (error: any) => {
            if (error) {
                config.app.logger.log(LogLevel.ERROR, error);
            } else {
                config.app.logger.log(LogLevel.INFO, `Server is listening on ${config.app.port}`);
                this.express.get("/users", (request: Request, response: Response) => {
                    Database.getInstance().getModel("users").all().then((result) => {
                        response.send(JSON.stringify(result));
                    }).catch(() => {
                        response.send("{}");
                    });
                });
                this.express.get("/createuser", (request: Request, response: Response) => {
                    let user = Database.getInstance().getModel("users");
                    user.create({ name: "Domenik", age: 24 }).then((result) => {
                        response.send(JSON.stringify(result));
                    }).catch((reason) => {
                        response.send(JSON.stringify(reason));
                    });
                });
                this.express.get("/deleteuser", (request: Request, response: Response) => {
                    let user = Database.getInstance().getModel("users");
                    user.destroy({ where: { name: "Domenik" } }).then((result) => {
                        response.send(JSON.stringify(result));
                    }).catch((reason) => {
                        response.send(JSON.stringify(reason));
                    });
                });
                this.express.get("/migrations", (request: Request, response: Response) => {
                    Database.getInstance().getModel("migrations").all().then((result) => {
                        response.send(JSON.stringify(result));
                    }).catch(() => {
                        response.send("{}");
                    });
                });
            }
        });
    }
}