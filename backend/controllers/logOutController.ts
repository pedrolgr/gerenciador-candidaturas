import type { Request, Response } from 'express';
import { UserCredentialsBody } from '../models/User/UserCredentials.schema';
import { signInService } from '../services/signIn.service';

export async function logOutController(req: Request, res: Response) {
    
    try {
        res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict"
    });

    return res.status(200).json({ message: "Logout ok" });

    } catch (error) {
        
    }
}