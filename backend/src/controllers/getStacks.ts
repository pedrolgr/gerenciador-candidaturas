import type { Request, Response } from "express";
import mongoose from 'mongoose';

export async function getStacks(req: Request, res: Response) {
    const stacks = mongoose.connection.collection('jobstacks');
    const docs = await stacks.find({}).toArray();


    console.log(docs)
    res.send(docs)

    return docs;
}