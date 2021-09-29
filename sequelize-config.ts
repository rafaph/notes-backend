module.exports = {
    [process.env.NODE_ENV as string]: {
        use_env_variable: "DATABASE_URL",
    },
};
