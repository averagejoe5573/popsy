/** Returns timestamp: HH-MM-SS_DD-MM-YYYY */
export function getTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}_${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
}

/** Convert ms to HH:MM:SS */
export function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
