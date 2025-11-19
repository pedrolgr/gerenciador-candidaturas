import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { jobApplicationController } from './controllers/JobApplication/jobApplication.controller.ts';
import { signUpController } from './controllers/signUp.controller.ts';
import { signInController } from './controllers/signIn.controller.ts';
import cors from "cors"

dotenv.config()

const app = express();
app.use(cors({
  origin:'http://localhost:5173'
}))
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI as string;

try {
  await mongoose.connect(MONGO_URI);
  const port = 3000;

  app.get('/', (req, res) => {
    res.send(`${app}`)
  })

  app.post('/api/jobapplication', jobApplicationController);
  app.post('/api/signup', signUpController);
  app.post('/api/signin', signInController);

  app.listen(port, () => {
    console.log(port)
  })
  
} catch (err) {
  console.log(err)
}

