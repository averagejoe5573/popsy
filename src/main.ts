import { Popsy } from "./popsy";
import { Log } from "./log";

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