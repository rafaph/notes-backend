import { Sequelize } from "sequelize";
import { env } from "@app/main/config/env";

export class SequelizeClient {
    private static sequelize?: Sequelize;

    public static getClient(connectionString: string = env.DATABASE_URL): Sequelize {
        if (this.sequelize === undefined) {
            this.sequelize = new Sequelize(connectionString, { logging: false });
        }
        return this.sequelize;
    }
}
