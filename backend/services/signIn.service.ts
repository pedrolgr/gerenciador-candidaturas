import { User } from "../models/User/User.model";
import type { UserCredentialsType } from "../models/User/UserCredentials.schema";
import bcrypt from 'bcrypt';

export class signInService {

    static async login(data: UserCredentialsType) {

        try {
            const searchUser = await User.findOne({ email: `${data.email}` });

            if(!searchUser) {
                throw new Error('Credenciais invalidas');
            }

            const isPasswordValid = await bcrypt.compare(data.password, searchUser.password)

            if(!isPasswordValid) {
                throw new Error('Credenciais invalidas');
            }

        } catch (e) {
            console.log(e)
        }
    }
}