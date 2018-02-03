import { Migration } from "../Migration";
import { Database } from "../Database";
import * as Sequelize from "sequelize";

export class TestMigration extends Migration {

    public constructor() {
        super("UserMigration", false);
    }

    public migrate(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let user = Database.getInstance().getConnection().define("user", {
                name: Sequelize.STRING,
                age: Sequelize.INTEGER,
            }, {
                    indexes: [
                        {
                            unique: true,
                            fields: ["name"],
                        },
                    ],
                });
            user.sync({ alter: true }).then(() => {
                user.create({ name: "Suu", age: 10 }).then(() => {
                    resolve();
                }).catch(reject);
            }).catch(reject);
        });
    }

}