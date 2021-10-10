const env = process.env.NODE_ENV as string;
let options = {};

if (env === "production") {
    options = {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    };
}

module.exports = {
    [env]: {
        use_env_variable: "DATABASE_URL",
        ...options,
    },
};

