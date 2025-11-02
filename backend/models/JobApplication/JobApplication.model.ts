import mongoose from 'mongoose';
const { Schema } = mongoose;

const JobApplicationSchema = new Schema({
    title: {type: String, required: true},
    company: {type: String},
    description: {type: String},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    isClosed: {type: Date},
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

export const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);