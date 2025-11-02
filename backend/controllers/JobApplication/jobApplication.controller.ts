import type { Request, Response } from "express";
import { JobApplicationServices } from "../../services/JobApplication/jobApplication.service";
import { JobApplicationBody } from "../../models/JobApplication/jobApplication.schema";




export function jobApplicationController(req: Request, res: Response) {

    try {
        const data = JobApplicationBody.parse(req.body);

        JobApplicationServices.createJobApplication(data)
        
        res.send("ok")

    } catch(e) {
        res.send(e)
        console.log(e)
    }

}