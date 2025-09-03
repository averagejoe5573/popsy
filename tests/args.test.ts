import { describe, it, expect } from "vitest";
import { Args } from "../src/args";
import { Log } from "../src/log";
import { LogLevel } from "../src/constants";

describe("Args", () => {
    it("parses provided options", () => {
        const log = new Log(LogLevel.DEBUG);
        const args = new Args(log, {
            msa: "file.fasta",
            parsimonyIterations: 5,
            logLevel: LogLevel.DEBUG,
            concurrency: 2,
            maxConcurrency: false,
        });

        expect(args.msa).toBe("file.fasta");
        expect(args.parsimonyIterations).toBe(5);
        expect(args.concurrency).toBe(2);
    });

    it("falls back to defaults if invalid", () => {
        const log = new Log();
        const args = new Args(log, {
            msa: "file.fasta",
            parsimonyIterations: -1,
            logLevel: LogLevel.INFO,
            concurrency: -1,
            maxConcurrency: false,
        });

        expect(args.parsimonyIterations).toBeGreaterThan(0);
        expect(args.concurrency).toBeGreaterThan(0);
    });
});
