import type { Request, Response } from "express";
import { JobApplicationServices } from "../../services/JobApplication/jobApplication.service";
import { JobApplicationBody } from "../../models/JobApplication/jobApplication.schema";

export async function createJobApplication(req: Request, res: Response) {
    try {
        const data = JobApplicationBody.parse(req.body);
        const userId = (req as any).user.id;

        const createdJob = await JobApplicationServices.createJobApplication(data, userId);
        res.status(201).json(createdJob);
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
}

export async function getJobApplications(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const jobs = await JobApplicationServices.getJobApplications(userId);
        res.status(200).json(jobs);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

export async function deleteJobApplication(req: Request, res: Response) {
    try {
        const { jobId } = req.params;
        const userId = (req as any).user.id;

        const deletedJob = await JobApplicationServices.deleteJobApplication(jobId, userId)

        res.status(200).json(deletedJob)

    } catch (e) {
        res.status(500).send(e);
        console.log
    }
}