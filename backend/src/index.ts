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
import multer from 'multer';
import { InvalidFileTypeError } from './errors/InvalidFileTypeError';
import { getStacks } from './controllers/getStacks';

dotenv.config()

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new InvalidFileTypeError("Apenas arquivos PDF são permitidos"));
    }
    cb(null, true);
  }
});

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


  app.post('/api/jobapplication', authenticateUser, upload.single("file"), createJobApplication);
  app.get('/api/jobapplication', authenticateUser, getJobApplications);
  app.delete('/api/jobapplication/:jobId', authenticateUser, deleteJobApplication);
  app.put('/api/jobapplication/:jobId', authenticateUser, upload.none(), updateJobApplication);

  app.get('/api/stacks', authenticateUser, getStacks);

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

