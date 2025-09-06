import { MIN_NODE_VERSION } from "../common/constants";

export function checkNodeVersion(minMajor: number = MIN_NODE_VERSION): void {
    const nodeVersion = process.versions.node;

    if (typeof nodeVersion !== "string") {
        throw new Error("Unable to detect Node.js version");
    }

    if (isNaN(parseInt(nodeVersion))) {
        throw new Error(`Invalid Node.js version format: ${nodeVersion}`);
    }

    if (parseInt(nodeVersion) < 18) {
        console.error(`Node.js version ${minMajor} is not supported. Please use Node 18 or newer.`);
        process.exit(1);
    }

    console.log(parseInt(nodeVersion))
}