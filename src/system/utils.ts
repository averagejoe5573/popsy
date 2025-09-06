import { MIN_NODE_VERSION } from "../common/constants";

export function checkNodeVersion(minNodeVersion: number = MIN_NODE_VERSION): void {
    const _nodeVersion = process.versions.node;
    const nodeVersion = parseInt(_nodeVersion)

    if (!nodeVersion) {
        throw new Error("Unable to detect Node.js version");
    }

    if (isNaN(nodeVersion)) {
        throw new Error(`Invalid Node.js version format: ${nodeVersion}`);
    }

    if (nodeVersion < minNodeVersion) {
        console.error(
            `Node.js version ${nodeVersion} is not supported. Please use Node ${minNodeVersion} or newer.`
        );
        process.exit(1);
    }
}
