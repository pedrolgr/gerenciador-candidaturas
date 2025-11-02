import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { jobApplicationController } from './controllers/JobApplication/jobApplication.controller.ts';

dotenv.config()

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI as string;


try {
  await mongoose.connect(MONGO_URI);
  const port = 3000;

  app.get('/', (req, res) => {
    res.send(`${app}`)
  })

  app.post('/jobapplication', jobApplicationController)
  app.post('/signup', signUpController)
    app.post('/signin', signInController)

  app.listen(port, () => {
    console.log(port)
  })
  
} catch (err) {
  console.log(err)
}

