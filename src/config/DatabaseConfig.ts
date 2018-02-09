import { LogLevel } from "./../logging/LogLevel";
import { FileLogger } from "./../logging/FileLogger";
import { Logger } from "../logging/Logger";
import { ConsoleLogger } from "../logging/ConsoleLogger";
import { Migration } from "../database/Migration";
import { UserMigration } from "../database/migrations/UserMigration";

/**
 * Configuration of the database.
 */
export class DatabaseConfig {
    /**
     * Logger that logs all information regarding the database.
     */
    public logger: Logger = new ConsoleLogger(true);

    /**
     * Port the database the application should connect to is running on.
     */
    public port: number = 5432;

    /**
     * Host address of the database server.
     */
    public host: string = "localhost";

    /**
     * Password of the database server.
     */
    public password: string = "85858585";

    /**
     * Name of the database.
     */
    public name: string = "lochat";

    /**
     * Name of the database user.
     */
    public user: string = "postgres";

    /**
     * If true, database gets wiped on startup. CAUTION NEVER EVER USE IN PRODUCTION!!!
     */
    public clear: boolean = true;

    /**
     * Name of the migrations table.
     */
    public migrationsTable: string = "migrations";

    public migrations: Migration[] = [
        new UserMigration(),
    ];
}

/**
 * Testing Databaseconfig-
 */
export let testDatabaseConfig: DatabaseConfig = new DatabaseConfig();
testDatabaseConfig.name = "lochat";
testDatabaseConfig.logger.setLogLevel(LogLevel.INFO);

/**
 * Development Databaseconfig.
 */
export let devDatabaseConfig: DatabaseConfig = new DatabaseConfig();

/**
 * Production Databaseconfig;
 */
export let productionDatabaseConfig: DatabaseConfig = new DatabaseConfig();
productionDatabaseConfig.logger = new FileLogger("databaselog", "databaselog");
productionDatabaseConfig.logger.setLogLevel(LogLevel.INFO);
productionDatabaseConfig.clear = false;

if (process.env.DB_PASSWORD) {
    productionDatabaseConfig.password = process.env.DB_PASSWORD;
}

if (process.env.DB_USER) {
    productionDatabaseConfig.user = process.env.DB_USER;
}

if (process.env.DB_HOST) {
    productionDatabaseConfig.host = process.env.DB_HOST;
}

if (process.env.DB_NAME) {
    productionDatabaseConfig.name = process.env.DB_NAME;
}