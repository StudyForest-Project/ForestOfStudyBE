import express from 'express';
import { studiesRouter } from './studies/studies.router.js';
import { focusRouter } from './studies/focus.router.js';

export const routers = express.Router();

routers.use('/studies', focusRouter);
routers.use('/studies', studiesRouter);
