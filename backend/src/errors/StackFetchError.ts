import { AppError } from "./AppError";

export class StackFetchError extends AppError {
    constructor(message: string) {
        super(message, 500);
    }
}
