import * as Sequelize from "sequelize";
import { setConfig, config } from "./config/Config";
import { Backend } from "./core/Backend";

if (process.env.NODE_ENV) {
  setConfig(process.env.NODE_ENV);
} else {
  setConfig("development");
}

let databaseInstance: Sequelize.Sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
  host: config.database.host,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

databaseInstance
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

Backend.getInstance().init();