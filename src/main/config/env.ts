import path from "path";

export const env = {
    NODE_ENV: process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    PORT: parseInt(process.env.PORT as string, 10),
    BASE_DIR: path.resolve(__dirname, "..", "..", ".."),
};
