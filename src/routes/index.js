import express from 'express';
import { studiesRouter } from './studies/index.js';

export const routers = express.Router();

routers.use('/studies', studiesRouter);
