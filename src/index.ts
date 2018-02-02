import * as Sequelize from "sequelize";
let databaseInstance = new Sequelize("lochat", "lochat", "85858585", {
  host: "0.0.0.0",
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
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

console.log("Hello World, I am LoChat. Im am running in " + process.env.NODE_ENV + " mode.");