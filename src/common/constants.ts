import os from "os";

/**
 * Paths and defaults for Popsy
 */
export const libPath = "./lib";
export const mpbootPath = "mpboot-avx";
export const iqtreePath = "iqtree2"
export const RESULTS_PATH = "results";

export const PARSIMONY_FILE_NAME = "parsimony-iteration-"

/**
 * Default parameters
 */
export const PARSIMONY_ITERATIONS = 100;
export const MAX_CONCURRENCY = os.cpus().length;
export const CONCURRENCY = 3;

/**
 * Logging levels
 */
export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}
