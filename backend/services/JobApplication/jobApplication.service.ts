import mongoose from 'mongoose';
import { JobApplication } from '../../models/JobApplication/JobApplication.model';
import type { JobApplicationType } from '../../models/JobApplication/jobApplication.schema';

export class JobApplicationServices {

    static async createJobApplication(data: JobApplicationType, userId: string) {
        const jobApplication = new JobApplication({ ...data, user: userId });
        await jobApplication.save();
        return jobApplication;
    }

    static async getJobApplications(userId: string) {

        return await JobApplication.find({ user: userId });
    }

}