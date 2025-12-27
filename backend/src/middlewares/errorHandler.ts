import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(err: any, req: Request, res: Response, next: any) {
    let error = err;

    if (!(err instanceof AppError)) {
        error = new AppError("Erro interno no servidor", 500);
        error.isOperational = false;
    }

    const status = error.statusCode || 500;

    if (process.env.NODE_ENV === 'DEV') {
        return res.status(status).json({
            status: "Error",
            message: error.message,
            details: error.details,
            stack: err.stack,
        })
    }

    return res.status(status).json({
        status: "Error",
        message: error.isOperational
            ? error.message
            : "Erro inesperado. Tente novamente mais tarde ou contate o administrador do sistema.",
    });

}
