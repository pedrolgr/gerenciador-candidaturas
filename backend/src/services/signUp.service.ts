import type { UserType } from '../models/User/User.schema';
import { User } from '../models/User/User.model';
import bcrypt from 'bcrypt';
import { ConflictError } from '../errors/ConflictError';

export class signUpServices {

    static async createUser(data: UserType) {

        try {
            const searchUser = await User.findOne({ email: `${data.email}` })

            if (searchUser) {
                throw new ConflictError("E-mail já está em uso!");
            }

            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            data.password = await bcrypt.hash(data.password, salt);

            const createdUser = await User.create(data);

            return createdUser;

        } catch (e) {
            console.log(e)
        }

    }
}