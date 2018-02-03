import { setConfig } from "./config/Config";
import { Backend } from "./core/Backend";
import { LocationModule } from "./modules/locations/LocationModule";
import { DocumentationModule } from "./modules/documentation/DocumentationModule";

if (process.env.NODE_ENV) {
  setConfig(process.env.NODE_ENV);
} else {
  setConfig("development");
}

Backend.getInstance().addModule(new DocumentationModule());
Backend.getInstance().addModule(new LocationModule());
Backend.getInstance().init();