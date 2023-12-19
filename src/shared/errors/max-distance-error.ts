export class MaxDistanceError extends Error {
    public actualDistance: number;
    public maxDistance: number;

    constructor(actualDistance: number, maxDistance: number) {
        super(`Max distance reached. Actual distance: ${actualDistance}, Max distance allowed: ${maxDistance}`);
        this.actualDistance = actualDistance;
        this.maxDistance = maxDistance;
    }
}