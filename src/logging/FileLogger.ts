import { Logger } from "./Logger";
import { LogLevel } from "./LogLevel";
import { ConsoleLogger } from "./ConsoleLogger";
import * as fileSystem from "fs";

/**
 * Writes received logging to a file.
 *
 * @author Domenik Irrgang
 * @version 1.0
 */
export class FileLogger implements Logger {

    private fileCreated: boolean = false;
    private path: string = "./logs/";
    private backupLogger: Logger = new ConsoleLogger();
    private logDebug: boolean;
    private logLevel: LogLevel;

    constructor(private title: string, private fileName: string, logDebug?: boolean, path?: string) {
        if (path) {
            this.path = path;
        }
        if (logDebug) {
            this.logDebug = logDebug;
            this.backupLogger = new ConsoleLogger(logDebug);
        } else {
            this.logDebug = false;
        }
    }

    public async init(): Promise<FileLogger> {
        this.fileCreated = await fileSystem.existsSync(this.path + this.fileName);
        if (this.fileCreated === false) {
            await fileSystem.writeFileSync(this.path + this.fileName, this.title + "\n");
            this.fileCreated = true;
        }
        return this;
    }

    public log(logLevel: LogLevel, message: string): void {
        if (this.logLevel <= logLevel) {
            if (this.fileCreated) {
                this.writeToFile(logLevel, message);
            } else {
                this.init().then(() => {
                    this.writeToFile(logLevel, message);
                });
            }
        }
    }

    public setLogLevel(loglevel: LogLevel): void {
        this.logLevel = loglevel;
    }

    /**
     * Writes message with loglevel to a file.
     *
     * @param logLevel The loglevel.
     * @param message The message.
     */
    private writeToFile(logLevel: LogLevel, message: string): void {
        if (this.logDebug === true || (this.logDebug === false && logLevel !== LogLevel.DEBUG)) {
            fileSystem.appendFile(this.path + this.fileName,
                new Date().toLocaleString() + " " + LogLevel.toString(logLevel) + ": " + message + "\n",
                (error: NodeJS.ErrnoException) => {
                    if (error) {
                        this.backupLogger.log(LogLevel.ERROR, "Could not write to file: " + this.path + this.fileName);
                        this.backupLogger.log(logLevel, message);
                    }
                });
        }
    }
}