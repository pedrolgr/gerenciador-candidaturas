import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    fullName: {type: String, required:true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})

UserSchema.statics = {
    async create(data) {
        try {
            const newUser = new User(data);
            const savedUser = await newUser.save();

            return savedUser;
            
        } catch(e) {
            console.log(e)
            throw new Error("Error during user creation");
        }
    },

    async delete(data) {

    },

    async edit(data) {

    }

}


export const User = mongoose.model('User', UserSchema);