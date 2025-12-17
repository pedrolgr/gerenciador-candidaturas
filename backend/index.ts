import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createJobApplication, getJobApplications } from './controllers/JobApplication/jobApplication.controller.ts';
import { signUpController } from './controllers/signUp.controller.ts';
import { signInController } from './controllers/signIn.controller.ts';
import cors from "cors"
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import { authController, authenticateUser } from './controllers/authController.ts';
import { logOutController } from './controllers/logOutController.ts';

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

  app.get('/', (req, res) => {
    res.send(`${app}`)
  })

  app.get('/api/auth', authController);


  app.post('/api/jobapplication', authenticateUser, createJobApplication);
  app.get('/api/jobapplication', authenticateUser, getJobApplications);

  app.post('/api/signup', signUpController);
  app.post('/api/signin', signInController);
  app.post('/api/logout', logOutController);

  app.listen(port, () => {
    console.log(port)
  })

} catch (err) {
  console.log(err)
}

