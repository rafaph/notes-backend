import { Sequelize } from "sequelize";
import { env } from "@app/main/config/env";

export class SequelizeClient {
    private static sequelize?: Sequelize;

    public static getClient(connectionString: string = env.DATABASE_URL): Sequelize {
        if (this.sequelize === undefined) {
            let options = {};

            if (env.NODE_ENV === "production") {
                options = {
                    dialectOptions: {
                        ssl: {
                            require: true,
                            rejectUnauthorized: false,
                        },
                    },
                };
            }
            this.sequelize = new Sequelize(connectionString, { logging: false, ...options });
        }
        return this.sequelize;
    }
}
