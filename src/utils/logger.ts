import pino from "pino";

const logLevel = (process.env.LOG_LEVEL || "info") as any;

const logger = pino({
  level: logLevel,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

export function createLogger(namespace: string) {
  return logger.child({ namespace });
}

export default logger;
