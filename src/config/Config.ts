import { DatabaseConfig, devDatabaseConfig, productionDatabaseConfig, testDatabaseConfig } from "./DatabaseConfig";
import { testAppConfig, AppConfig, productionAppConfig, devAppConfig } from "./AppConfig";

/**
 * General Configuration of the Backend.
 */
export class Config {
    /**
     * Configuration of the database.
     */
    public database: DatabaseConfig;

    /**
     * General configuration of the app.
     */
    public app: AppConfig;

    /**
     * Name of the environment the application is running in.
     */
    public environment: string;
}

let environment: string = process.env.NODE_ENV;
if (!environment) {
    environment = "development";
}

let configs: { [environment: string]: Config } = {};

configs.test = {
    database: testDatabaseConfig,
    app: testAppConfig,
    environment: "test",
};

configs.production = {
    database: productionDatabaseConfig,
    app: productionAppConfig,
    environment: "production",
};

configs.development = {
    database: devDatabaseConfig,
    app: devAppConfig,
    environment: "development",
};

/**
 * Global config that is can be read from inside the application.
 */
let config: Config = configs[environment];

export let setConfig = (env: string) => {
    if (configs[env]) {
        config = configs[env];
    }
};

export { config as config };