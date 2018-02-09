import { Migration } from "../Migration";
import { Database } from "../Database";
import * as Sequelize from "sequelize";

/**
 * Define User model in database.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class UserMigration extends Migration {

    public constructor() {
        super("UserMigration09022018_1448", true);
    }

    public migrate(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let user = Database.getInstance().getConnection().define("user", {
                name: Sequelize.STRING,
                authToken: Sequelize.STRING,
                phoneNumber: Sequelize.STRING,
                birthday: Sequelize.DATE,
            }, {
                    indexes: [
                        {
                            unique: true,
                            fields: ["name", "phoneNumber"],
                        },
                    ],
                });
            user.sync().then(() => { resolve(); }).catch(reject);
        });
    }

}