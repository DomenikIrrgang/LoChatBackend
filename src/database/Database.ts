import { config } from "../config/Config";
import * as Sequelize from "sequelize";
import { LogLevel } from "../logging/LogLevel";
import { MigrationHandler } from "./MigrationHandler";
import * as SequelizeModels from "sequelize-models";

/**
 * Database handler.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class Database {

    private static instance: Database;
    private connection: Sequelize.Sequelize;

    private models: { [modelName: string]: any } = {};

    private constructor() { }

    // tslint:disable-next-line:member-ordering
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Create new database when in development/test environment.
     * Create new database when in production environment only when no database exists, otherwise do not initialize.
     *
     * @param callback Called when database setup is completed.
     */
    public init(): Promise<void> {
        config.app.logger.log(LogLevel.INFO, "Initializing database...");
        this.connection = new Sequelize(config.database.name, config.database.user, config.database.password, {
            host: config.database.host,
            port: config.database.port,
            dialect: "postgres",
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
            omitNull: true,
            logging: false,
        });

        return new Promise<void>((resolve, reject) => {
            this.connection.authenticate()
                .then(() => {
                    this.onAuthenticationSuccess().then(() => {
                        let migrationHandler: MigrationHandler = new MigrationHandler(config.database.migrations);
                        migrationHandler.init().then(() => {
                            migrationHandler.run().then(() => {
                                this.loadModels().then(() => {
                                    resolve();
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                })
                .catch((error) => {
                    this.onAuthenticationError(() => {
                        reject();
                    });
                });
        });
    }

    /**
     * Returns the connection of the Sequelize intance.
     *
     * @returns Connection of the Sequelize instance.
     */
    public getConnection(): Sequelize.Sequelize {
        return this.connection;
    }

    /**
     * Adds a model to the database.models collection.
     *
     * @param name Name of the model.
     * @param model The model to be added.
     */
    public addModel(name: string, model: any) {
        this.models[name] = model;
    }

    /**
     * Returns a model of the database for a given name.
     *
     * @param name Name of the requested model.
     * @returns The model. Undefined if model does not exist.
     */
    public getModel(name: string) {
        return this.models[name];
    }

    private onAuthenticationSuccess(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            config.database.logger.log(
                LogLevel.INFO, "Connection to database on " + config.database.host + ":" + config.database.port + " has been established.");
            if (config.database.clear && config.environment !== "production") {
                this.connection.query("drop schema public cascade;create schema public;").then(resolve).catch((reason) => {
                    config.database.logger.log(LogLevel.ERROR, "Could not clear database");
                    if (reason) {
                        config.database.logger.log(LogLevel.ERROR, "Reason: " + reason.toString());
                    }
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    private loadModels(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            config.database.logger.log(LogLevel.INFO, "Loading models...");
            let sequelizeModels = new SequelizeModels({
                connection: {
                    host: config.database.host,
                    port: config.database.port,
                    dialect: "postgres",
                    username: config.database.user,
                    schema: config.database.name,
                    password: config.database.password,
                },
                models: {
                    autoLoad: true,
                    path: "/models",
                },
                sequelizeOptions: {
                    logging: false,
                    omitNull: true,
                },
            });
            sequelizeModels.getSchema().then((schema) => {
                for (let model in schema.models) {
                    if (model) {
                        // tslint:disable-next-line:no-string-literal
                        this.addModel(model.toLowerCase(), schema.models[model]);
                    }
                }
                resolve();
            }).catch((reason) => {
                config.database.logger.log(LogLevel.ERROR, "Could not load models from database.");
                if (reason) {
                    config.database.logger.log(LogLevel.ERROR, "Reason: " + reason.toString());
                }
                reject();
            });
        });
    }

    private onAuthenticationError(callback: () => void): void {
        config.database.logger.log(
            LogLevel.ERROR, "Could not connect to database on " + config.database.host + ":" + config.database.port + ".");
        callback();
    }
}