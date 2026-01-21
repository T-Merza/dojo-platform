export type TrainingLevel = "Beginner" | "Intermediate" | "Advanced";

export type SessionStatus =
  | "Open"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export type CoachGameApproval = {
  game: string;
  maxTrainingLevel: TrainingLevel;
};

export type CoachProfile = {
  coachId: string;
  name: string;
  approvedGames: CoachGameApproval[];
};

export type CoachAvailability = {
  coachId: string;
  game: string; // must be approved in CoachProfile
  date: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
};

const trainingLevelOrder: TrainingLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

function getAllowedTrainingLevels(
  maxLevel: TrainingLevel
): TrainingLevel[] {
  const maxIndex = trainingLevelOrder.indexOf(maxLevel);
  return trainingLevelOrder.slice(0, maxIndex + 1);
}

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
  enrolledStudentIds: string[];

  minStudents: number;
  status: SessionStatus;
};


const DEFAULT_SESSION_DURATION = 90;

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0, 0);

  return date.toTimeString().slice(0, 5);
}

export function generateSessionsFromAvailability(
  availability: CoachAvailability[],
  coaches: CoachProfile[]
): Session[] {
  const sessions: Session[] = [];

  availability.forEach((block) => {
    const coach = coaches.find(
      (c) => c.coachId === block.coachId
    );
    if (!coach) return;

    const approval = coach.approvedGames.find(
      (g) => g.game === block.game
    );
    if (!approval) return;

    const allowedLevels = getAllowedTrainingLevels(
      approval.maxTrainingLevel
    );

    let currentTime = block.startTime;

    while (true) {
      const endTime = addMinutes(currentTime, DEFAULT_SESSION_DURATION);
      if (endTime > block.endTime) break;

      allowedLevels.forEach((level) => {
        sessions.push({
          id: crypto.randomUUID(),
          coachId: coach.coachId,
          coachName: coach.name,
          game: block.game,
          trainingLevel: level,
          date: block.date,
          startTime: currentTime,
          endTime,
          durationMinutes: DEFAULT_SESSION_DURATION,

          maxStudents: block.maxStudents,
          minStudents: 2,
          enrolledStudentIds: [],
          status: "Open",
        });
      });

      currentTime = endTime;
    }
  });

  return sessions;
}

export function handleJoin(
  session: Session,
  userId: string
): Session {
  if (session.enrolledStudentIds.includes(userId)) {
    return session;
  }

  if (session.enrolledStudentIds.length >= session.maxStudents) {
    return session;
  }

  const updatedStudents = [...session.enrolledStudentIds, userId];

  let status = session.status;
  if (updatedStudents.length >= session.minStudents) {
    status = "Pending";
  }

  return {
    ...session,
    enrolledStudentIds: updatedStudents,
    status,
  };
}

export function evaluateSessionStatus(
  session: Session
): SessionStatus {
  if (session.status === "Cancelled") return "Cancelled";

  const count = session.enrolledStudentIds.length;

  if (count >= session.minStudents) return "Pending";

  return "Open";
}

