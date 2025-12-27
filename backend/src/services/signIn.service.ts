import { User } from "../models/User/User.model";
import type { UserCredentialsType } from "../models/User/UserCredentials.schema";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { InternalServerError } from "../errors/InternalServerError";

dotenv.config()

export class signInService {

    static async login(data: UserCredentialsType) {

        try {
            const searchUser = await User.findOne({ email: `${data.email}` });
            console.log(searchUser)

            if (!searchUser) {
                throw new UnauthorizedError('Credenciais inválidas');
            }

            const isPasswordValid = await bcrypt.compare(data.password, searchUser.password)

            if (!isPasswordValid) {
                throw new UnauthorizedError('Credenciais inválidas');
            }

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error("JWT_SECRET não está definido");
            }

            const token = jwt.sign(
                {
                    "id": searchUser._id,
                    "email": searchUser.email
                },
                secret,
                {
                    expiresIn: "60m"
                }
            )

            return token;

        } catch (e) {
            console.log(e)
        }
    }
}