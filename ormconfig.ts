import { DB } from '@app/domains/common/utils/environment';

const { HOST, PORT, USERNAME, PASSWORD, DATABASE } = DB;

module.exports = {
    type: 'postgres',
    host: HOST,
    port: PORT,
    username: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    entities: [
        'src/domains/user/core/entities/*.ts',
    ],
    migrations: ['migrations/*.ts'],
    cli: {
        migrationsDir: 'migrations',
    },
};
