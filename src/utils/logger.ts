import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.prettyPrint(),
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

const wrapper = (original: winston.LeveledLogMethod) => {
    return (message: string, meta?: unknown): void => {
        original(message, meta ? { logData: meta } : null);
    };
};

export const Logger = {
    error: wrapper(logger.error),
    warn: wrapper(logger.warn),
    info: wrapper(logger.info),
    verbose: wrapper(logger.verbose),
    debug: wrapper(logger.debug),
    silly: wrapper(logger.silly),
};


