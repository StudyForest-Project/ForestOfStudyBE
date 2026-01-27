import express from 'express';
import { studiesRouter } from './studies/studies.router.js';

export const routers = express.Router();

routers.use('/studies', studiesRouter);
