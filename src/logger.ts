import { createLogger, format, transports } from "winston";

const myFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.splat(),
    format.colorize(),
    myFormat
  ),
  transports: [new transports.Console()],
});
