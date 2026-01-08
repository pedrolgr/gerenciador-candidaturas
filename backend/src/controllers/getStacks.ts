import type { Request, Response } from "express";
import mongoose from 'mongoose';

import { StackFetchError } from "../errors/StackFetchError";

export async function getStacks(req: Request, res: Response, next: Function) {
    try {
        const stacks = mongoose.connection.collection('jobstacks');
        const docs = await stacks.find({}).toArray();

        if (docs.length === 0) throw new StackFetchError("Não foi possível buscar nenhuma Stack do Banco de Dados.")

        res.status(200).json(docs);

    } catch (error) {
        next(error);
    }
}