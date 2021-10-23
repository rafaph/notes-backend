import { ConnectionString } from "connection-string";

function requiredEnvVar(varName: string): never {
    // eslint-disable-next-line no-console
    console.error("\x1b[31m%s\x1b[0m", `⚠️  Required environment variable "${varName}" is missing.`);

    process.exit(1);
}

function setIfEmpty(variable: string, value?: number | string): void {
    if (typeof value === "number") {
        value = value.toString(10);
    }
    process.env[variable] = process.env[variable] || value;
}

if (process.env.DATABASE_URL) {
    const { hostname, port, user, password, path } = new ConnectionString(process.env.DATABASE_URL);
    setIfEmpty("DB_HOST", hostname);
    setIfEmpty("DB_PORT", port);
    setIfEmpty("DB_USERNAME", user);
    setIfEmpty("DB_PASSWORD", password);
    setIfEmpty("DB_DATABASE", path ? path[0] : undefined);
}

// Common Variables
export const ENV = process.env.NODE_ENV || "development";
export const PORT = Number(process.env.PORT || 3000);
export const PROD = ENV === "production";
export const SHUTDOWN_TIMEOUT = Number(process.env.SHUTDOWN_TIMEOUT || 10000);

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || requiredEnvVar("JWT_SECRET");

// Database
export const DB = {
    HOST: process.env.DB_HOST || requiredEnvVar("DB_HOST"),
    PORT: Number(process.env.DB_PORT || 5432),
    USERNAME: process.env.DB_USERNAME || requiredEnvVar("DB_USERNAME"),
    PASSWORD: process.env.DB_PASSWORD || requiredEnvVar("DB_PASSWORD"),
    DATABASE: process.env.DB_DATABASE || requiredEnvVar("DB_DATABASE"),
};
