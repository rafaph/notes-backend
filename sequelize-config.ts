const env = process.env.NODE_ENV as string;
let options = {};

if (env === "production") {
    options = {
        ssl: true,
        dialectOptions: {
            ssl: true,
            rejectUnauthorized: false,
        }
    };
}

module.exports = {
    [env]: {
        use_env_variable: "DATABASE_URL",
        ...options,
    },
};

