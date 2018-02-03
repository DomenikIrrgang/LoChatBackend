import { Migration } from "./Migration";
import { config } from "../config/Config";
import { LogLevel } from "../logging/LogLevel";
import { Database } from "./Database";
import * as Sequelize from "sequelize";

/**
 * Runs all migrations in order.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class MigrationHandler {

    /**
     * Number of migrations that have been completed.
     */
    private migrationsDone: number = 0;

    /**
     * Database model of the migrations table.
     */
    private migrationsModel: any;

    /**
     * Definition of the migrations table.
     */
    private migrationsDefinition: Sequelize.DefineAttributes = {
        name: Sequelize.STRING,
    };

    /**
     * Migration table indexes.
     */
    private migrationsIndexes: object = {
        indexes: [
            {
                unique: true,
                fields: ["name"],
            },
        ],
    };

    /**
     * Creates a new MigrationHandler with the migrations it should execute.
     * 
     * @param migrations Migrations that should be run.
     */
    public constructor(private migrations: Migration[]) { }

    /**
     * Initializes the migrations table if it does not exist yet.
     *
     * @returns Promise that resolves once migrations table is ready.
     */
    public init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.migrationsModel = Database.getInstance().getConnection()
                .define(config.database.migrationsTable, this.migrationsDefinition, this.migrationsIndexes);
            this.migrationsModel.sync().then(() => {
                resolve();
            }).catch((reason) => {
                config.database.logger.log(LogLevel.ERROR, "Could not initilize migrations table.");
                if (reason) {
                    config.database.logger.log(LogLevel.ERROR, "Reason: " + reason.toString());
                }
                reject();
            });
        });
    }

    /**
     * Runs all migrations.
     * 
     * @returns Promise that resolves once all migrations have been run.
     */
    public run(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            config.database.logger.log(LogLevel.INFO, "Running migrations...");
            this.runMigrations()
                .then(() => {
                    config.database.logger.log(LogLevel.INFO, "Finished all migrations.");
                    resolve();
                })
                .catch(() => {
                    config.database.logger.log(LogLevel.INFO, "Could not run all migrations.");
                    reject();
                });
        });
    }

    private runMigrations(): Promise<void> {
        if (this.migrationsDone >= this.migrations.length) {
            return new Promise<void>((resolve, reject) => {
                resolve();
            });
        }
        return new Promise<void>((resolve, reject) => {
            this.migrationsModel.count({ where: { name: this.migrations[this.migrationsDone].getName() } }).then((count: number) => {
                if (count === 0 && (!(!this.migrations[this.migrationsDone].isProduction() && config.environment === "production"))) {
                    config.database.logger.log(LogLevel.INFO, "Running migration: " + this.migrations[this.migrationsDone].getName());
                    this.migrations[this.migrationsDone].migrate()
                        .then(() => {
                            this.migrationsModel.create({ name: this.migrations[this.migrationsDone++].getName() }).then(() => {
                                this.runMigrations().then(() => {
                                    resolve();
                                }).catch(reject);
                            }).catch(reject);
                        })
                        .catch((reason) => {
                            config.database.logger.log(
                                LogLevel.ERROR, "Migration: " + this.migrations[this.migrationsDone].getName() + " failed.");
                            if (reason) {
                                config.database.logger.log(
                                    LogLevel.ERROR, "Reason: " + reason.toString());
                            }
                            reject();
                        });
                } else {
                    config.database.logger.log(LogLevel.INFO, "Skipping migration: " + this.migrations[this.migrationsDone].getName());
                    this.migrationsDone++;
                    this.runMigrations().then(() => {
                        resolve();
                    }).catch(() => {
                        reject();
                    });
                }
            });
        });
    }

}