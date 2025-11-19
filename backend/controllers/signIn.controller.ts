import type { Request, Response } from 'express';
import { UserCredentialsBody } from '../models/User/UserCredentials.schema';
import { signInService } from '../services/signIn.service';

export async function signInController(req: Request, res: Response) {
    
    try {
        const data = UserCredentialsBody.parse(req.body);

        const token = await signInService.login(data);

        if(token) {
            res.cookie('token', token, { httpOnly: true });
            res.send(token);
        } else {
            res.status(400).send('Error during creating user!');
        }

    } catch (error) {
        res.send(error)
    }
}