import type { Request, Response } from "express";
import { JobApplicationServices } from "../../services/JobApplication/jobApplication.service";
import { JobApplicationBody } from "../../models/JobApplication/jobApplication.schema";

export async function jobApplicationController(req: Request, res: Response) {

    try {
        const data = JobApplicationBody.parse(req.body);

        const createdJobApplication = await JobApplicationServices.createJobApplication(data);

    } catch(e) {
        res.send(e)
        console.log(e)
    }

}