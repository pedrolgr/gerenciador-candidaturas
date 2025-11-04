import mongoose from 'mongoose';
import { JobApplication } from '../../models/JobApplication/JobApplication.model';
import type { JobApplicationType } from '../../models/JobApplication/jobApplication.schema';

export class JobApplicationServices {

    static async createJobApplication(data:JobApplicationType) {

        const searchJobApplication = await JobApplication.findOne(data)

        if(!searchJobApplication) {
            console.log("notfound")
        } else {
            console.log("found")
        }
        
    }

}