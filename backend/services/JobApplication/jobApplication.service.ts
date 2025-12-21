import mongoose from 'mongoose';
import { JobApplication } from '../../models/JobApplication/JobApplication.model';
import type { JobApplicationType } from '../../models/JobApplication/jobApplication.schema';

export class JobApplicationServices {

    static async createJobApplication(data: JobApplicationType, userId: string) {
        try {
            const newJob = {
                ...data,
                user: userId
            };

            const jobApplication = await JobApplication.create(newJob);

            return jobApplication;
        } catch(e) {
            console.log(e)
        }
    }

    static async getJobApplications(userId: string) {

        return await JobApplication.find({ user: userId });
    }

}