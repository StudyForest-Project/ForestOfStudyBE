import express from 'express';
import { studiesRouter as studiesMainRouter } from './studies.router.js';
import { studiesEmojiRouter } from './studies.emoji.router.js';
import { studiesAuthRouter } from './studies.auth.router.js';
import { focusRouter } from './focus.router.js';
import { habitsRouter } from './habits.router.js';

export const studiesRouter = express.Router();

studiesRouter.use('/', studiesMainRouter);
studiesRouter.use('/', studiesEmojiRouter);
studiesRouter.use('/', studiesAuthRouter);
studiesRouter.use('/', focusRouter);
studiesRouter.use('/', habitsRouter);
