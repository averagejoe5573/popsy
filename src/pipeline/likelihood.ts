import { executeCommand } from "../system/commands";
import { libPath, iqtreePath, LogLevel, MAX_CONCURRENCY } from "../common/constants";
import { join } from "path";
import { Args } from "../cli/args";
import { Log } from "../common/log";
import { moveFiles } from "../system/files";

export class LikelihoodAnalysis {
    constructor(private args: Args, private log: Log) { }

    public async executeLikelihoodAnalysis(timestampFolderPath: string, folderPath: string): Promise<void> {
        const likelihoodPath = join(process.cwd(), libPath, iqtreePath);
        const parsimonyTree = join(timestampFolderPath, "parsimony/parsimony_combined.treefile");
        const cmdArgs = [
            "-s", this.args.msa,
            "-t", parsimonyTree,
            "-nt", MAX_CONCURRENCY.toString(),
            "-pre", "likelihood"
        ];
        const shouldLog = this.args.logLevel === LogLevel.DEBUG;

        this.log.info("[Likelihood] Starting");
        await executeCommand(likelihoodPath, cmdArgs, { log: shouldLog });
        this.log.info("[Likelihood] Complete");

        await moveFiles("likelihood.*", folderPath, this.log, this.args.concurrency);
    }
}
