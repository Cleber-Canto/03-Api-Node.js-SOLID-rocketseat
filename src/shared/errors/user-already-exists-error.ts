export class UserAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`E-mail '${email}' already exists.`);
    }
}
