import type { Request, Response } from 'express';
import { UserCredentialsBody } from '../models/User/UserCredentials.schema';
import { signInService } from '../services/signIn.service';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { BadRequestError } from '../errors/BadRequestError';

export async function signInController(req: Request, res: Response, next: Function) {

    try {
        const validation = UserCredentialsBody.safeParse(req.body);

        if (!validation.success) {
            throw new BadRequestError(`Erro de validação: ${validation.error.message}`);
        }

        const data = validation.data;

        const token = await signInService.login(data);

        if (token) {
            res.cookie('token', token, { httpOnly: true });
            res.send(token);
        } else {
            throw new UnauthorizedError('Credenciais inválidas.');
        }

    } catch (error) {
        next(error);
    }
}