export type TrainingLevel = "Beginner" | "Intermediate" | "Advanced";

export type CoachAvailability = {
  coachId: string;
  coachName: string;
  game: string;
  trainingLevels: TrainingLevel[];
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
  maxStudents: number;
};

export type Session = {
  id: string;
  coachId: string;
  coachName: string;
  game: string;
  trainingLevel: TrainingLevel;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  maxStudents: number;
  enrolledStudents: number;
};

const DEFAULT_SESSION_DURATION = 90;

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0, 0);

  return date.toTimeString().slice(0, 5);
}

export function generateSessionsFromAvailability(
  availability: CoachAvailability[]
): Session[] {
  const sessions: Session[] = [];

  availability.forEach((block) => {
    let currentTime = block.startTime;

    while (true) {
      const endTime = addMinutes(
        currentTime,
        DEFAULT_SESSION_DURATION
      );

      if (endTime > block.endTime) break;

      block.trainingLevels.forEach((level) => {
        sessions.push({
          id: crypto.randomUUID(),
          coachId: block.coachId,
          coachName: block.coachName,
          game: block.game,
          trainingLevel: level,
          date: block.date,
          startTime: currentTime,
          endTime,
          durationMinutes: DEFAULT_SESSION_DURATION,
          maxStudents: block.maxStudents,
          enrolledStudents: 0,
        });
      });

      currentTime = endTime;
    }
  });

  return sessions;
}
