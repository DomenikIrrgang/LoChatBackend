import { setConfig } from "./config/Config";
import { Backend } from "./core/Backend";

if (process.env.NODE_ENV) {
  setConfig(process.env.NODE_ENV);
} else {
  setConfig("development");
}

Backend.getInstance().init();