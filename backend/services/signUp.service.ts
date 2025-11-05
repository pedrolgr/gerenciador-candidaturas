import type { Request, Response } from 'express';
import type { UserType } from '../models/User/User.schema';
import { User } from '../models/User/User.model';
import bcrypt from 'bcrypt';

export class signUpServices {

    static async createUser(data: UserType) {

        try {
            const searchUser = await User.findOne({ email: `${data.email}` })
            
            if (searchUser) {
                throw new Error("User already exists!");
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