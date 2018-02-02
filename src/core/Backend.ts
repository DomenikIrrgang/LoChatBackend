export class Backend {

    public static getInstance(): Backend {
        if (!Backend.backend) {
            Backend.backend = new Backend();
        }
        return Backend.backend;
    }

    private static backend: Backend;
    private constructor() {}

}