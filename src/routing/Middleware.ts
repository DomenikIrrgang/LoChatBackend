import { Request, Response } from "express";

/**
 * A middleware is a check inbetween a request arriving at the server and a controller actually handeling the request.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export interface Middleware {
    /**
     * Is invoked if a route is requested.
     *
     * @param request The incoming request.
     * @param response The response that is send back.
     * @returns True if request should be forwared to the controller, otherwise false.
     */
    onRequest(request: Request, response: Response): Promise<void>;
}