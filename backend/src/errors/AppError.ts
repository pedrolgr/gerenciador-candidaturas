export class AppError extends Error {
    public statusCode: number;
    public details: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, details: any = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}