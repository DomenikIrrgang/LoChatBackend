import { BackendModule } from "../../core/BackendModule";
import { RouterConfig } from "../../routing/RouterConfig";
import { LocationRouterConfig } from "./LocationRouterConfig";

export class LocationModule implements BackendModule {

    private routerConfig: RouterConfig = new LocationRouterConfig("");

    public init(callback?: (module: BackendModule) => void): void {
        if (callback) {
            callback(this);
        }
    }

    public getName(): string {
        return "LocationModule";
    }

    public getRoutes(): RouterConfig {
        return this.routerConfig;
    }

}