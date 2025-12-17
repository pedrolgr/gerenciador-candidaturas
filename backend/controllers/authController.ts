import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function authController(req: Request, res: Response) {

    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: decoded });
    } catch (err) {
        res.status(401).json({ json: "Invalid Token" });
    }
}

export async function authenticateUser(req: Request, res: Response, next: Function) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token." });
    }
}