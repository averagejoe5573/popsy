import { mkdirSync, existsSync } from "fs";
import { join } from "path";
import { RESULTS_PATH } from "../constants";
import { Log } from "../log";
import pLimit from "p-limit";
import { readdir } from "fs/promises";
import { getTimestamp } from "./time";
import { executeCommand } from "./commands";

/** Create timestamped folder for results */
export function createTimestampFolder(): string {
    const timestamp = getTimestamp();
    const relativeTimestampFolderPath = join(RESULTS_PATH, timestamp);
    const timestampFolderPath = join(process.cwd(), RESULTS_PATH, timestamp);

    if (!existsSync(timestampFolderPath)) {
        mkdirSync(join(timestampFolderPath, "parsimony"), { recursive: true });
        mkdirSync(join(timestampFolderPath, "likelihood"), { recursive: true });
    }

    return relativeTimestampFolderPath;
}

/** Move files matching a pattern to a destination folder, in parallel with concurrency control */

export async function moveFiles(
    pattern: string,
    destFolder: string,
    log: Log,
    maxConcurrent = 3
): Promise<void> {
    const files = await readdir(process.cwd());
    const matchedFiles = files.filter(f => f.match(pattern));

    if (matchedFiles.length === 0) {
        log.warn(`No files matching pattern "${pattern}" found to move.`);
        return;
    }

    log.info(`Found ${matchedFiles.length} files matching "${pattern}". Moving to ${destFolder}...`);

    const limit = pLimit(maxConcurrent);

    await Promise.all(
        matchedFiles.map(file =>
            limit(async () => {
                const src = join(process.cwd(), file);
                const dest = join(destFolder, file);
                try {
                    await executeCommand("mv", [src, dest], { log: false });
                    log.debug(`Moved ${file} -> ${dest}`);
                } catch (err: any) {
                    log.error(`Failed to move ${file}: ${err.stderr ?? err.message}`);
                }
            })
        )
    );

    log.info(`All files matching "${pattern}" moved successfully.`);
}