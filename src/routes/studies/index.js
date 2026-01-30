import express from 'express';
import { studiesCrudRouter } from './studies.crud.router.js';
import { studiesEmojiRouter } from './studies.emoji.router.js';
import { studiesAuthRouter } from './studies.auth.router.js';
import { focusRouter } from './focus.router.js';

export const studiesRouter = express.Router();

studiesRouter.use('/', studiesCrudRouter);
studiesRouter.use('/', studiesEmojiRouter);
studiesRouter.use('/', studiesAuthRouter);
studiesRouter.use('/', focusRouter);
