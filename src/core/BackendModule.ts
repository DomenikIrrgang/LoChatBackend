export interface BackendModule {
    init(): void;
    onServerReady(): void;
    onServerShutdown(): void;
    onServerStart(): void;
    onServerRestart(): void;
}