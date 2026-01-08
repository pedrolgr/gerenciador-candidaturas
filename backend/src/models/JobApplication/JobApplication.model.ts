import mongoose from 'mongoose';
const { Schema } = mongoose;

const JobApplicationSchema = new Schema({
    title: { type: String, required: true },
    company: { type: String },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isClosed: { type: Date },
    resume: { type: Buffer },
    stacks: { type: Array },
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

JobApplicationSchema.statics = {
    async create(data) {
        try {
            const jobApplication = new JobApplication(data);
            const savedJobApplication = await jobApplication.save();
            console.log(jobApplication)
            console.log(savedJobApplication)

            return savedJobApplication;
        } catch (e) {
            console.log(e)
            throw new Error("Error during job application creation");
        }
    },

    async delete(data) {
        try {
            return await JobApplication.deleteOne({ _id: data })
        } catch (e) {
            console.log(e)
            throw new Error("Error during delete job application");
        }
    },

    async update(data) {
        return await JobApplication.findByIdAndUpdate(
            data.jobId,
            {
                $set: {
                    title: data.title,
                    company: data.company,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    isClosed: data.isClosed,
                    stacks: data.stacks
                }
            },
            { new: true, runValidators: true }
        )
    },

    async findJobById(jobId) {
        return await JobApplication.findById(jobId);
    }
}

export const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);