import { FileLogger } from "./../logging/FileLogger";
import { Logger } from "../logging/Logger";
import { ConsoleLogger } from "../logging/ConsoleLogger";
import { LogLevel } from "../logging/LogLevel";

// import { FileLogger } from "../logging/FileLogger";

/**
 * Configuration of Express.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class AppConfig {

    /**
     * Logger used for logging app related information.
     */
    public logger: Logger = new ConsoleLogger(true);

    /**
     * Port the application runs on.
     */
    public port: number = 8080;

    /**
     * Host that are allowed to do cross-origin requests on the app.
     */
    public originWhitelist: string[] = [
        "localhost",
    ];

    /**
     * Number of rounds bcrypt uses to hash the passwords.
     */
    public hashRound: number = 10;
}

/**
 * Development Appconfig.
 */
export let devAppConfig: AppConfig = new AppConfig();
devAppConfig.logger.setLogLevel(LogLevel.DEBUG);

/**
 * Production Appconfig.
 */
export let productionAppConfig: AppConfig = new AppConfig();
productionAppConfig.logger.setLogLevel(LogLevel.ERROR);
productionAppConfig.logger = new FileLogger("applog", "applog");

/**
 * Test Appconfig.
 */
export let testAppConfig: AppConfig = new AppConfig();
testAppConfig.logger.setLogLevel(LogLevel.INFO);


