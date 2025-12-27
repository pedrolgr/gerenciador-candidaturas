import type { Request, Response } from "express";
import { JobApplicationServices } from "../services/JobApplication/jobApplication.service";
import { JobApplicationBody } from "../models/JobApplication/jobApplication.schema";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";

export async function createJobApplication(req: Request, res: Response, next: Function) {
    try {
        const validation = JobApplicationBody.safeParse(req.body);
        if (!validation.success) {
            throw new BadRequestError(`Erro de validação: ${validation.error.message}`);
        }
        const data = validation.data;
        const userId = (req as any).user.id;

        const createdJob = await JobApplicationServices.createJobApplication(data, userId);
        res.status(201).json(createdJob);
    } catch (e) {
        next(e);
    }
}

export async function getJobApplications(req: Request, res: Response, next: Function) {
    try {
        const userId = (req as any).user.id;
        const jobs = await JobApplicationServices.getJobApplications(userId);
        res.status(200).json(jobs);
    } catch (e) {
        next(e);
    }
}

export async function updateJobApplication(req: Request, res: Response, next: Function) {
    try {
        const { jobId } = req.params;
        const validation = JobApplicationBody.safeParse(req.body);

        if (!validation.success) {
            throw new BadRequestError(`Erro de validação: ${validation.error.message}`);
        }

        const data = validation.data;

        const jobData = {
            ...data,
            jobId: jobId
        }

        const userId = (req as any).user.id;
        const updateJob = await JobApplicationServices.updateJobApplication(jobData, userId);

        if (!updateJob) {
            throw new NotFoundError("Vaga não encontrada para atualização.");
        }

        res.status(200).json(updateJob);
    } catch (e) {
        next(e);
    }
}

export async function deleteJobApplication(req: Request, res: Response, next: Function) {
    try {
        const { jobId } = req.params;
        const userId = (req as any).user.id;

        const deletedJob = await JobApplicationServices.deleteJobApplication(jobId, userId)

        if (!deletedJob) {
            throw new NotFoundError("Vaga não encontrada para exclusão.");
        }

        res.status(200).json(deletedJob)

    } catch (e) {
        next(e);
    }
}