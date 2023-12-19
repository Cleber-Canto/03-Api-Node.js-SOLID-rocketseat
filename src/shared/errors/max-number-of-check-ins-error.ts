export class MaxNumberOfCheckInsError extends Error {
    constructor(message: string = 'Max number of check-ins reached.') {
        super(message);
        this.name = 'MaxNumberOfCheckInsError';
    }
}
