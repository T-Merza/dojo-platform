"use client";

import { useState } from "react";

type TrainingLevel = "Beginner" | "Intermediate" | "Advanced";

type Session = {
  id: string;
  game: string;
  trainingLevel: TrainingLevel;
  coachName: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  enrolledStudents: number;
};

const sessions: Session[] = [
  {
    id: "s1",
    game: "Naraka: Bladepoint",
    trainingLevel: "Beginner",
    coachName: "Coach Alpha",
    startTime: "2025-01-20 18:00",
    endTime: "2025-01-20 19:30",
    maxStudents: 5,
    enrolledStudents: 2,
  },
  {
    id: "s2",
    game: "Naraka: Bladepoint",
    trainingLevel: "Intermediate",
    coachName: "Coach Beta",
    startTime: "2025-01-20 20:00",
    endTime: "2025-01-20 21:30",
    maxStudents: 4,
    enrolledStudents: 4,
  },
  {
    id: "s3",
    game: "Naraka: Bladepoint",
    trainingLevel: "Advanced",
    coachName: "Coach Gamma",
    startTime: "2025-01-21 19:00",
    endTime: "2025-01-21 20:30",
    maxStudents: 3,
    enrolledStudents: 1,
  },
];

export default function SessionsPage() {
  const [selectedGame, setSelectedGame] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<
    TrainingLevel | "All"
  >("All");

  const filteredSessions = sessions.filter((session) => {
    const gameMatch =
      selectedGame === "All" || session.game === selectedGame;

    const levelMatch =
      selectedLevel === "All" ||
      session.trainingLevel === selectedLevel;

    return gameMatch && levelMatch;
  });

  const games = ["All", ...new Set(sessions.map((s) => s.game))];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Available Sessions
      </h1>

      <p className="text-gray-400 mb-6">
        Choose a game, training level, and time slot that fits your schedule.
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
        >
          {games.map((game) => (
            <option key={game} value={game}>
              {game}
            </option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(e) =>
            setSelectedLevel(e.target.value as TrainingLevel | "All")
          }
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Sessions */}
      <div className="space-y-4">
        {filteredSessions.length === 0 && (
          <p className="text-gray-500">
            No sessions match your filters.
          </p>
        )}

        {filteredSessions.map((session) => {
          const isFull =
            session.enrolledStudents >= session.maxStudents;

          return (
            <div
              key={session.id}
              className="p-6 rounded-xl bg-gray-900 border border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {session.game} — {session.trainingLevel}
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Coach: {session.coachName}
                </p>

                <p className="text-gray-400 text-sm">
                  {session.startTime} → {session.endTime}
                </p>

                <p className="text-gray-400 text-sm mt-1">
                  Spots: {session.enrolledStudents} /{" "}
                  {session.maxStudents}
                </p>
              </div>

              <button
                disabled={isFull}
                className={`px-6 py-3 rounded-lg transition ${
                  isFull
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isFull ? "Session Full" : "Join Session"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
