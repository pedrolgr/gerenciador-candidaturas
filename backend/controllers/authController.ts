import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function authController(req: Request, res: Response) {

    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: decoded });
    } catch (err) {
        res.status(401).json({json: "Invalid Token"});
    }

}