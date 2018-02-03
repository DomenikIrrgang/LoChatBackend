import { BackendModule } from "./BackendModule";
import { config } from "../config/Config";
import { LogLevel } from "../logging/LogLevel";
import { Express } from "express";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import { Database } from "../database/Database";
import { RouteHandler } from "../routing/RouteHandler";

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

    /**
     * Handles the routing of the backend instance.
     */
    private routeHandler: RouteHandler;

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
            .catch((reason) => {
                config.app.logger.log(LogLevel.ERROR, "Database could not be initialized. Shuting down...");
                if (reason) {
                    config.app.logger.log(LogLevel.ERROR, "Reason: " + reason.toString());
                }
            });
    }

    /**
     * Adds a module to the backend.
     *
     * @param module Module to be added to the backend.
     */
    public addModule(module: BackendModule) {
        this.modules.push(module);
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

    private onModuleLoaded = (module: BackendModule) => {
        this.routeHandler.applyRouterConfig(module.getRoutes());
        config.app.logger.log(LogLevel.INFO,
            "Loaded module: " + module.getName() + ". " + ++this.modulesLoaded + "/" + this.modules.length + " modules loaded.");
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
        this.express.use("/documentation", express.static("docs"));
        this.routeHandler = new RouteHandler(this.express);
    }

    private startServer(): void {
        this.express.listen(config.app.port, (error: any) => {
            if (error) {
                config.app.logger.log(LogLevel.ERROR, "Could not start server.");
                config.app.logger.log(LogLevel.ERROR, error);
            } else {
                config.app.logger.log(LogLevel.INFO, `Server is listening on ${config.app.port}`);
            }
        });
    }
}