import { Route } from "../../routing/Route";
import { HttpMethod } from "../../routing/HttpMethod";
import { GetLocationsController } from "./controller/GetLocationsController";
import { RouterConfig } from "../../routing/RouterConfig";


let routes: Route[] = [
    new Route(HttpMethod.GET, "/location", new GetLocationsController()),
];

/**
 * Defines routes of the location module.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class LocationRouterConfig extends RouterConfig {

    constructor(baseURL: string) {
        super(baseURL);
        for (let route of routes) {
            this.addRoute(route);
        }
    }
}