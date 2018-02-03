import { Controller } from "../../../routing/Controller";
import { Request, Response } from "express";

export class GetLocationsController implements Controller {
    public onRequest(request: Request, response: Response): void {
        response.send({ message: "Test!" });
    }

}