import { Route } from "./Route";
import { Request } from "express";
import { Response } from "express-serve-static-core";

/**
 * Executes all middlewares of a given route.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class MiddlewareHandler {

    /**
     * Number of middlewares that completed already.
     */
    private middlewaresDone: number = 0;

    /**
     * Creates a new MiddlewareHandler
     *
     * @param route Route of which all middlewares will be executed.
     */
    public constructor(private route: Route) { }

    /**
     * Execute all middlewares of the route. Resolves if all middlewares passed, else rejects.
     *
     * @param request Incoming request of the route.
     * @param response Outgoing response.
     */
    public handleMiddleware(request: Request, response: Response): Promise<void> {
        if (this.middlewaresDone >= this.route.getMiddlewares().length) {
            return new Promise<void>((resolve, reject) => {
                resolve();
            });
        }
        return new Promise<void>((resolve, reject) => {
            this.route.getMiddlewares()[this.middlewaresDone++].onRequest(request, response)
                .then(() => {
                    this.handleMiddleware(request, response).then(() => {
                        resolve();
                    }).catch(reject);
                })
                .catch((reason) => {
                    reject();
                });
        });
    }
}