-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "botMessageHour" INTEGER NOT NULL DEFAULT 21,
    "botMessageMinute" INTEGER NOT NULL DEFAULT 0,
    "monthlyReportHour" INTEGER NOT NULL DEFAULT 23,
    "monthlyReportMinute" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
