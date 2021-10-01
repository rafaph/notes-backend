import { Sequelize } from "sequelize";
import { env } from "@app/main/config/env";

export class SequelizeClient {
    private static sequelize?: Sequelize;

    public static getClient(connectionString: string = env.DATABASE_URL): Sequelize {
        if (this.sequelize === undefined) {
            this.sequelize = new Sequelize(connectionString);
        }
        return this.sequelize;
    }

    public static async close(): Promise<void>{
        await this.sequelize?.close();
    }
}
