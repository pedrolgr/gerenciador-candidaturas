
import mongoose from 'mongoose';
import { JobApplication } from '../../models/JobApplication/JobApplication.model';
import type { JobApplicationType } from '../../models/JobApplication/jobApplication.schema';
import type { deleteJobApplication } from '../../controllers/jobApplication.controller';
import { ForbiddenError } from '../../errors/ForbiddenError';

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
            console.log(e);
            throw e;
        }
    }

    static async getJobApplications(userId: string) {

        return await JobApplication.find({ user: userId });
    }

    static async updateJobApplication(data: JobApplicationType, userId: string) {
        try {
            // @ts-ignore
            const searchJob = await JobApplication.findJobById(data.jobId)
            const jobUserId = searchJob.user[0].toString();

            if (jobUserId !== userId) throw new ForbiddenError("Acesso negado");

            // @ts-ignore
            const updateJobApplication = await JobApplication.update(data);
            return updateJobApplication;

        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    static async deleteJobApplication(jobId: any, userId: string) {
        try {
            // @ts-ignore
            const searchJob = await JobApplication.findJobById(jobId)
            const jobUserId = searchJob.user[0].toString();

            if (jobUserId !== userId) throw new ForbiddenError("Acesso negado");

            // @ts-ignore
            const deleteJobApplication = await JobApplication.delete(jobId)

            return deleteJobApplication;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

}