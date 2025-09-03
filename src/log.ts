import { LogLevel } from "./constants";
import { getTimestamp } from "./utils";

/**
 * Simple logger with timestamp and log levels.
 */
export class Log {
    constructor(private level: LogLevel = LogLevel.INFO) { }

    private shouldLog(level: LogLevel): boolean {
        return level <= this.level;
    }

    private format(level: string, message: string): string {
        const timestamp = getTimestamp();
        return `[${timestamp}] [${level}] ${message}`;
    }

    error(message: string) { if (this.shouldLog(LogLevel.ERROR)) console.error(this.format("ERROR", message)); }
    warn(message: string) { if (this.shouldLog(LogLevel.WARN)) console.warn(this.format("WARN", message)); }
    info(message: string) { if (this.shouldLog(LogLevel.INFO)) console.log(this.format("INFO", message)); }
    debug(message: string) { if (this.shouldLog(LogLevel.DEBUG)) console.debug(this.format("DEBUG", message)); }
}
