import type { Request, Response } from 'express';
import { UserBody, type UserType } from '../models/User/User.schema';
import { signUpServices } from '../services/signUp.service';
import { BadRequestError } from '../errors/BadRequestError';


export async function signUpController(req: Request, res: Response, next: Function) {

    try {
        const validation = UserBody.safeParse(req.body);
        if (!validation.success) {
            throw new BadRequestError(`Erro de validação: ${validation.error.message}`);
        }
        const data = validation.data;

        const createdUser = await signUpServices.createUser(data);

        if (createdUser) {
            res.status(201).send(`Usuário criado: ${createdUser}`);
        } else {
            throw new BadRequestError('Erro ao criar usuário.');
        }

    } catch (e) {
        next(e);
    }
}