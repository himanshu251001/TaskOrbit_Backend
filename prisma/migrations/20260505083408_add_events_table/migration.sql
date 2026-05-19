-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Meeting', 'Workshop', 'Webinar', 'Conference', 'Training', 'Seminar');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('scheduled', 'cancelled', 'completed');

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "event_type" "EventType" NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "max_participants" INTEGER,
    "status" "EventStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
