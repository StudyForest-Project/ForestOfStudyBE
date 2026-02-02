import express from 'express';
import { habitsRepository } from '#repository';
import { NotFoundException } from '../../errors/notFoundException.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { requireStudyAccess } from '#middlewares/auth.middleware.js';
import { validateId } from '../../utils/idValidate.js';
import { validate } from '#middlewares/validate.middleware.js';
import {
  createHabitValidator,
  updateHabitValidator,
  toggleHabitValidator,
} from '#validators';

export const habitsRouter = express.Router();

// 오늘의 습관 목록 조회
// METHOD:GET studies/:studyId/today-habits
habitsRouter.get(
  '/:studyId/today-habits',
  requireStudyAccess,
  async (req, res) => {
    const { studyId } = req.params;
    const habitDetailList = await habitsRepository.findTodayHabits(studyId);
    console.log(habitDetailList, '======================');
    if (!habitDetailList) {
      throw new NotFoundException(ERROR_MESSAGE.HABIT_DETAIL_NOT_FOUND);
    }

    res.json(habitDetailList);
  },
);

//METHOD:POST studies/:studyId/habits
habitsRouter.post(
  '/:studyId/habits',
  requireStudyAccess,
  validate(createHabitValidator),
  async (req, res) => {
    const { studyId } = req.params;
    validateId(studyId);
    const habitData = await habitsRepository.create(req.body, studyId);

    res.status(HTTP_STATUS.CREATED).json({ habit: habitData });
  },
);

//METHOD:PATCH studies/:studyId/habits/:habitId
habitsRouter.patch(
  '/:studyId/habits/:habitId',
  requireStudyAccess,
  validate(updateHabitValidator),
  async (req, res) => {
    const { habitId } = req.params;
    validateId(habitId);
    const patchHabit = await habitsRepository.update(habitId, req.body);
    res.status(HTTP_STATUS.OK).json({ habit: patchHabit });
  },
);

//METHOD:DELETE studies/:studyId/habits/:habitId
habitsRouter.delete(
  '/:studyId/habits/:habitId',
  requireStudyAccess,
  async (req, res) => {
    const { habitId } = req.params;
    validateId(habitId);
    const deleteHabit = await habitsRepository.remove(habitId);
    res.status(HTTP_STATUS.OK).json({ success: true, habit: deleteHabit });
  },
);

//METHOD:POST(TOGGLE) /studies/:studyId/habits/:habitId/toggle
habitsRouter.post(
  '/:studyId/habits/:habitId/toggle',
  requireStudyAccess,
  validate(toggleHabitValidator),
  async (req, res) => {
    const { habitId } = req.params;
    const { checked } = req.body;
    validateId(habitId);
    const habitToggle = await habitsRepository.toggleLog(habitId, checked);
    res.status(HTTP_STATUS.OK).json({ success: true, habit: habitToggle });
  },
);
