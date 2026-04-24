type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

function formatMessage(level: LogLevel, ...args: any[]) {
    const timestamp = new Date().toISOString();

    const prefix = `[${timestamp}] [${level}]`;
    return [prefix, ...args];
}

function logMessage(level: LogLevel, ...args: any[]) {
    const formatted = formatMessage(level, ...args);

    switch (level) {
        case "DEBUG":
            console.debug(...formatted);
            break;
        case "WARN":
            console.warn(...formatted);
            break;
        case "ERROR":
            console.error(...formatted);
            break;
        default:
            console.log(...formatted);
    }
}

export function debug(...args: any[]) {
    logMessage("DEBUG", ...args);
}

export function warn(...args: any[]) {
    logMessage("WARN", ...args);
}

export function error(...args: any[]) {
    logMessage("ERROR", ...args);
}

export function log(...args: any[]) {
    logMessage("INFO", ...args);
}
