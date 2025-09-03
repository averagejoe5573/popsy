import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Log } from "../src/log";
import { LogLevel } from "../src/constants";

describe("Log", () => {
    let log: Log;

    beforeEach(() => {
        log = new Log(LogLevel.DEBUG);
        vi.spyOn(console, "error").mockImplementation(() => { });
        vi.spyOn(console, "warn").mockImplementation(() => { });
        vi.spyOn(console, "log").mockImplementation(() => { });
        vi.spyOn(console, "debug").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("logs error messages", () => {
        log.error("Error message");
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Error message"));
    });

    it("respects log level (INFO should not log debug)", () => {
        const infoLog = new Log(LogLevel.INFO);
        vi.spyOn(console, "debug").mockImplementation(() => { });
        infoLog.debug("Debug message");
        expect(console.debug).not.toHaveBeenCalled();
    });
});
