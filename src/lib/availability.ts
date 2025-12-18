export type WeeklyAvailabilityBlock = {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "18:00"
  endTime: string;   // "20:00"
  game: string;
  maxStudents: number;
};

import { CoachAvailability } from "./scheduling";

/**
 * Expands weekly availability into concrete date-based availability
 */
export function expandWeeklyAvailability(
  weekly: WeeklyAvailabilityBlock[],
  coachId: string,
  weeksAhead: number = 4
): CoachAvailability[] {
  const results: CoachAvailability[] = [];
  const today = new Date();

  for (let week = 0; week < weeksAhead; week++) {
    for (const block of weekly) {
      const date = new Date(today);
      date.setDate(
        today.getDate() +
          ((block.dayOfWeek + 7 - today.getDay()) % 7) +
          week * 7
      );

      results.push({
        coachId,
        game: block.game,
        date: date.toISOString().split("T")[0],
        startTime: block.startTime,
        endTime: block.endTime,
        maxStudents: block.maxStudents,
      });
    }
  }

  return results;
}
