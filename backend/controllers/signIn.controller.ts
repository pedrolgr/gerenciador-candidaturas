import type { Request, Response } from 'express';
import { UserCredentialsBody } from '../models/User/UserCredentials.schema';
import { signInService } from '../services/signIn.service';

export async function signInController(req: Request, res: Response) {
    
    try {
        const data = UserCredentialsBody.parse(req.body);

        const loggedUser = await signInService.login(data);

        if(loggedUser) {
            res.send(`User logged`);
        } else {
            res.status(400).send('Error during creating user!');
        }

    } catch (error) {
        res.send(error)
    }
}