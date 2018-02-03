/**
 * A Migration is a change in the database. That changed will also be stored in the database so it is known what has been done already.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export abstract class Migration {
    protected production: boolean;
    private name: string;

    protected constructor(name: string, isProduction: boolean) {
        this.name = name;
        this.production = isProduction;
    }

    public getName(): string {
        return this.name;
    }

    public abstract migrate(): Promise<void>;
}