import { Migration } from "../Migration";
import { Database } from "../Database";
import * as Sequelize from "sequelize";

export class TestMigration2 extends Migration {

    public constructor() {
        super("UserMigration2", false);
    }

    public migrate(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let user = Database.getInstance().getConnection().define("user", {
                name: Sequelize.STRING,
            }, {
                    indexes: [
                        {
                            unique: true,
                            fields: ["name"],
                        },
                    ],
                });
            user.sync({ alter: true }).then(() => {
                user.create({ name: this.getName() }).then(() => {
                    resolve();
                }).catch(reject);
            }).catch(reject);
        });
    }

}