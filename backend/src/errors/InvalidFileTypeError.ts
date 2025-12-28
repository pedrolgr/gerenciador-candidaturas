import { AppError } from "./AppError";

export class InvalidFileTypeError extends AppError {
    constructor(message: string) {
        super(message, 400)
    }
}