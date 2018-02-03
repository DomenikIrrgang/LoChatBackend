import { RouterConfig } from "../routing/RouterConfig";

/**
 * Module that can be loaded into the backend.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export interface BackendModule {
    /**
     * Called during the initialization phase of the backend, after the database connection has been setup.
     * Do any work that needs to be done during startup in here and call the callback ones the module is ready.
     *
     * @param module Callback to be called once everything is ready.
     */
    init(callback?: (module: BackendModule) => void): void;

    /**
     * Returns the name of the module.
     *
     * @return Name of the module.
     */
    getName(): string;

    /**
     * Returns all routes the modules wants to register in the backend.
     *
     * @returns Routes that will be registered in the backend.
     */
    getRoutes(): RouterConfig;
}