export interface BackendModule {
    init(callback?: (module: BackendModule) => void): void;
    getName(): string;
}