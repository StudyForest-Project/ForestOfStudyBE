-- CreateTable
CREATE TABLE "study" (
    "id" VARCHAR(26) NOT NULL,
    "title" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "backgroundImage" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "totalPoint" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit" (
    "id" VARCHAR(26) NOT NULL,
    "studyId" VARCHAR(26) NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habit_log" (
    "id" VARCHAR(26) NOT NULL,
    "habitId" VARCHAR(26) NOT NULL,
    "logDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "focus_session" (
    "id" VARCHAR(26) NOT NULL,
    "studyId" VARCHAR(26) NOT NULL,
    "targetTime" INTEGER NOT NULL,
    "activeTime" INTEGER NOT NULL,
    "pauseUsed" BOOLEAN NOT NULL DEFAULT false,
    "earnedPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "focus_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_emoji" (
    "id" VARCHAR(26) NOT NULL,
    "studyId" VARCHAR(26) NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_emoji_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_log_habitId_logDate_key" ON "habit_log"("habitId", "logDate");

-- AddForeignKey
ALTER TABLE "habit" ADD CONSTRAINT "habit_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_log" ADD CONSTRAINT "habit_log_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_session" ADD CONSTRAINT "focus_session_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_emoji" ADD CONSTRAINT "study_emoji_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "study"("id") ON DELETE CASCADE ON UPDATE CASCADE;
