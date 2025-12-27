import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createJobApplication, getJobApplications, deleteJobApplication, updateJobApplication } from './controllers/jobApplication.controller';
import { signUpController } from './controllers/signUp.controller';
import { signInController } from './controllers/signIn.controller';
import cors from "cors"
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import { authenticateUser } from './controllers/authController';
import { logOutController } from './controllers/logOutController';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config()

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());


const MONGO_URI = process.env.MONGO_URI as string;

try {
  await mongoose.connect(MONGO_URI);
  const port = 3000;

  app.get('/api/auth', authenticateUser, (req, res) => {
    res.status(200).json({ user: (req as any).user });
  });


  app.post('/api/jobapplication', authenticateUser, createJobApplication);
  app.get('/api/jobapplication', authenticateUser, getJobApplications);
  app.delete('/api/jobapplication/:jobId', authenticateUser, deleteJobApplication);
  app.put('/api/jobapplication/:jobId', authenticateUser, updateJobApplication);

  app.post('/api/signup', signUpController);
  app.post('/api/signin', signInController);
  app.post('/api/logout', logOutController);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(port)
  })

} catch (err) {
  console.log(err)
}

