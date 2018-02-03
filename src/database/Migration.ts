/**
 * A Migration is a change in the database. That changed will also be stored in the database so it is known what has been done already.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export abstract class Migration {
    private production: boolean;
    private name: string;

    public constructor(name: string, production: boolean) {
        this.name = name;
        this.production = production;
    }

    /**
     * Returns the name of the migration.
     *
     * @returns Name of the migration.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Returns true if migration should be used in production.
     *
     * @returns True if migration should be run in production.
     */
    public isProduction(): boolean {
        return this.production;
    }

    /**
     * Run all database changes for the migration in here.
     *
     * @returns Promise that will finish if migration is finished.
     */
    public abstract migrate(): Promise<void>;
}