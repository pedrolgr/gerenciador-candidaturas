import mongoose from 'mongoose';
import { JobApplication } from '../../models/JobApplication/JobApplication.model';
import type { JobApplicationType } from '../../models/JobApplication/jobApplication.schema';
import type { deleteJobApplication } from '../../controllers/JobApplication/jobApplication.controller';

export class JobApplicationServices {

    static async createJobApplication(data: JobApplicationType, userId: string) {
        try {
            const newJob = {
                ...data,
                user: userId
            };

            const jobApplication = await JobApplication.create(newJob);

            return jobApplication;
        } catch (e) {
            console.log(e)
        }
    }

    static async getJobApplications(userId: string) {

        return await JobApplication.find({ user: userId });
    }

    static async deleteJobApplication(jobId: string) {
        try {
            const deleteJobApplication = await JobApplication.delete(jobId)

            return deleteJobApplication;
        } catch (e) {
            console.log(e)
        }
    }

}