import { User } from "../models/User/User.model";
import type { UserCredentialsType } from "../models/User/UserCredentials.schema";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

export class signInService {

    static async login(data: UserCredentialsType) {

        try {
            const searchUser = await User.findOne({ email: `${data.email}` });
            console.log(searchUser)

            if(!searchUser) {
                throw new Error('Credenciais invalidas');
            }

            const isPasswordValid = await bcrypt.compare(data.password, searchUser.password)

            if(!isPasswordValid) {
                throw new Error('Credenciais invalidas');
            }

            const token = jwt.sign(
                {
                    "id": searchUser._id,
                    "email": searchUser.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:"5m"
                }
            )

            return token;

        } catch (e) {
            console.log(e)
        }
    }
}