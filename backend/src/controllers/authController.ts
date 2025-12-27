import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { InternalServerError } from '../errors/InternalServerError';

export async function authenticateUser(req: Request, res: Response, next: Function) {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new UnauthorizedError("Não autorizado, favor realizar o login.");
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new InternalServerError("O secret do JWT não está definido.");
        }

        const decoded = jwt.verify(token, secret);
        (req as any).user = decoded;
        next();
    } catch (err) {
        throw new UnauthorizedError("Token inválido ou expirado.");
    }
}