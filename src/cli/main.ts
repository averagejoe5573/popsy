#!/usr/bin/env node

import { Popsy } from "../pipeline/popsy";
import { Log } from "../common/log";
import { checkNodeVersion } from "../system/utils";

checkNodeVersion()

async function main() {
    const log = new Log();

    try {
        const popsy = new Popsy(log);
        await popsy.execute();
    } catch (error: unknown) {
        if (error instanceof Error) log.error(`Error: ${error.message}`);
        else log.error(`Unknown error: ${error}`);
        process.exit(1);
    }
}

main();