import { Command } from "commander";
import { PARSIMONY_ITERATIONS, LogLevel, CONCURRENCY } from "./constants";
import { Log } from "./log";

/**
 * Handles CLI and programmatic arguments for Popsy
 */
export class Args {
    public msa: string;
    public parsimonyIterations: number;
    public logLevel: LogLevel;
    public concurrency: number;
    public maxConcurrency: boolean;

    constructor(private log: Log, options?: {
        msa: string; parsimonyIterations: number;
        logLevel: LogLevel; concurrency: number; maxConcurrency: boolean;
    }) {
        if (options) {
            this.msa = options.msa;
            this.parsimonyIterations = options.parsimonyIterations;
            this.logLevel = options.logLevel;
            this.concurrency = options.concurrency;
            this.maxConcurrency = options.maxConcurrency;
        } else {
            const program = new Command();
            program
                .name("Popsy")
                .description("CLI wrapper for phylogenetic analysis")
                .option("--msa <string>", "Path to the multiple sequence alignment file")
                .option("--parsimony-iterations <number>", "Number of parsimony trees to generate",
                    (val: string) => parseInt(val, 10), PARSIMONY_ITERATIONS)
                .option("--log-level <level>", "Logging level (error, warn, info, debug)", "info")
                .option("--concurrency <number>", "Number of iterations in parallel",
                    (val: string) => parseInt(val, 10), CONCURRENCY)
                .option("--max-concurrency", "Use all available CPU cores", false);

            program.parse(process.argv);

            const cliOptions = program.opts<{
                msa: string; parsimonyIterations: number;
                logLevel: string; concurrency: number; maxConcurrency: boolean;
            }>();

            this.msa = cliOptions.msa;
            this.parsimonyIterations = cliOptions.parsimonyIterations;
            this.logLevel = this.validateLogLevel(cliOptions.logLevel);
            this.concurrency = cliOptions.concurrency;
            this.maxConcurrency = cliOptions.maxConcurrency ?? false;

            this.validateRequiredArgs();
            this.validateArgs();
        }
    }

    /** Ensure required arguments are provided */
    private validateRequiredArgs() {
        if (!this.msa) {
            this.log.error("Error: --msa argument is required");
            process.exit(1);
        }
    }

    /** Validate numeric arguments and assign defaults if necessary */
    private validateArgs() {
        if (this.parsimonyIterations <= 0 || Number.isNaN(this.parsimonyIterations)) {
            this.log.warn(`Parsimony iterations invalid, setting to default: ${PARSIMONY_ITERATIONS}`);
            this.parsimonyIterations = PARSIMONY_ITERATIONS;
        }
        if (this.concurrency <= 0 || Number.isNaN(this.concurrency)) {
            this.log.warn(`Concurrency invalid, setting to default: ${CONCURRENCY}`);
            this.concurrency = CONCURRENCY;
        }
    }

    /** Convert CLI string to enum value */
    private validateLogLevel(level: string): LogLevel {
        switch (level.toLowerCase()) {
            case "error": return LogLevel.ERROR;
            case "warn": return LogLevel.WARN;
            case "info": return LogLevel.INFO;
            case "debug": return LogLevel.DEBUG;
            default:
                this.log.warn(`Unknown log level "${level}", defaulting to INFO`);
                return LogLevel.INFO;
        }
    }
}
