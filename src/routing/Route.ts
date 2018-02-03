import { Controller } from "./Controller";
import { Middleware } from "./Middleware";

/**
 * Represents a route to which a request can be send from outside the application.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class Route {
    /**
     * Method type of the request the route should respond to.
     */
    private method: string;

    /**
     * Path of the Route. Example: /user:id
     */
    private path: string;

    /**
     * Controller that is going to handle the endpoint of the route.
     */
    private controller: Controller;

    /**
     * Middlewares that have been applied to the route.
     */
    private middlewares: Middleware[] = [];

    /**
     * Creates a new instance of a route class.
     *
     * @param method Method of the request the route should respond to.
     * @param path Path of the route the server should respond to.
     * @param controller Endpoint that should handle the request.
     */
    constructor(method: string, path: string, controller: Controller) {
        this.method = method;
        this.path = path;
        this.controller = controller;
    }

    /**
     * Returns the Controller of the route.
     *
     * @returns Controller of the route.
     */
    public getController(): Controller {
        return this.controller;
    }

    /**
     * Returns the method the route is responding to.
     *
     * @returns Request method the route should respond to.
     */
    public getMethod(): string {
        return this.method;
    }

    /**
     * Returns the path the route should respond to,
     *
     * @returns Path the route should respond to.
     */
    public getPath(): string {
        return this.path;
    }

    /**
     * Returns all middlewares that have been applied to the route.
     *
     * @returns All middlewares applied to the route.
     */
    public getMiddlewares(): Middleware[] {
        return this.middlewares;
    }

    /**
     * Adds a middleware to the route and returns itself.
     *
     * @param middlware Middleware that is getting added.
     * @returns The route the function has been called on. (method chaining)
     */
    public addMiddlware(middlware: Middleware): Route {
        this.middlewares.push(middlware);
        return this;
    }
}