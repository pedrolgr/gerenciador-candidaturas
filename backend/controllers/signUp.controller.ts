import type { Request, Response } from 'express';
import { UserBody, type UserType } from '../models/User/User.schema';
import { signUpServices } from '../services/signUp.service';


export async function signUpController(req: Request, res: Response) {
    
    try {
        const data = UserBody.parse(req.body);
        
        const createdUser = await signUpServices.createUser(data);
        
        console.log(createdUser)

        if(createdUser) {
            res.send(`User created: ${createdUser}`);
        } else {
            res.send('Error')
        }

    } catch(e) {
        console.log(e)
    }
}