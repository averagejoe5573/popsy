import { describe, it, expect, vi, beforeEach } from "vitest";
import { ParsimonyAnalysis } from "../src/parsimony";
import { Args } from "../src/args";
import { Log } from "../src/log";
import { LogLevel } from "../src/constants";
import * as utils from "../src/utils/commands";

describe("ParsimonyAnalysis", () => {
    let log: Log;
    let args: Args;
    let folderPath = ""

    beforeEach(() => {
        log = new Log(LogLevel.DEBUG);
        args = new Args(log, {
            msa: "test.fasta",
            parsimonyIterations: 2,
            logLevel: LogLevel.DEBUG,
            concurrency: 1,
            maxConcurrency: false,
        });

        vi.spyOn(utils, "executeCommand").mockImplementation(async () => ({
            stdout: "ok",
            stderr: "",
            code: 0,
        }));
    });

    it("runs parsimony jobs", async () => {
        const analysis = new ParsimonyAnalysis(args, log);
        const results = await analysis.executeParsimonyAnalysis(folderPath);
        expect(results).toHaveLength(2);
        expect(results[0]).toHaveProperty("stdout", "ok");
    });

    it("handles command failures", async () => {
        (utils.executeCommand as any).mockRejectedValueOnce(new Error("fail"));

        const analysis = new ParsimonyAnalysis(args, log);
        const results = await analysis.executeParsimonyAnalysis(folderPath);
        expect(results[0]).toHaveProperty("error");
    });
});
