"use client";

import { useState } from "react";
import {
  TrainingLevel,
  CoachAvailability,
  CoachProfile,
  Session,
  generateSessionsFromAvailability,
} from "@/lib/scheduling";
import { GAMES } from '@/lib/games';

export default function SessionsPage() {
  // Filters
  const [selectedGame, setSelectedGame] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<
    TrainingLevel | "All"
  >("All");

  // Example availability (replace later with DB / API)
  const availability: CoachAvailability[] = [
    {
      coachId: "alpha",
      game: "Naraka: Bladepoint",
      date: "2025-01-20",
      startTime: "18:00",
      endTime: "21:00",
      maxStudents: 5,
    },
    {
      coachId: "beta",
      game: "Naraka: Bladepoint",
      date: "2025-01-20",
      startTime: "20:00",
      endTime: "22:30",
      maxStudents: 4,
    },
  ];

  const coaches: CoachProfile[] = [
  {
    coachId: "alpha",
    name: "Coach Alpha",
    approvedGames: [
      {
        game: "Naraka: Bladepoint",
        maxTrainingLevel: "Intermediate",
      },
    ],
  },
];

  // Fake User ID (Temp)
  const currentUserId = "student-123";

  // Generate sessions from availability
  const generatedSessions = generateSessionsFromAvailability(availability, coaches);
  const [sessionState, setSessionState] = useState<Session[]>(generatedSessions);


  // Apply filters
  const filteredSessions = sessionState.filter((session) => {
    const gameMatch =
      selectedGame === "All" || session.game === selectedGame;
    const levelMatch =
      selectedLevel === "All" || session.trainingLevel === selectedLevel;

    return gameMatch && levelMatch;
  });

  const games = ["All", ...GAMES.map(g => g.name)];

  function joinSession(sessionId: string) {
    setSessionState((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        if (
          session.enrolledStudentIds.length >= session.maxStudents ||
          session.enrolledStudentIds.includes(currentUserId)
        ) {
          return session;
        }

        return {
          ...session,
          enrolledStudents: session.enrolledStudentIds.length + 1,
          enrolledStudentIds: [
            ...session.enrolledStudentIds,
            currentUserId,
          ],
        };
      })
    );
  }



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
            No  match your filters.
          </p>
        )}

        {filteredSessions.map((session) => {
          const isFull =
            session.enrolledStudentIds.length >= session.maxStudents;

          // Check If User Joined Already
          const alreadyJoined = session.enrolledStudentIds.includes(currentUserId);

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
                  {session.date} {session.startTime} → {session.endTime}
                </p>

                <p className="text-gray-400 text-sm mt-1">
                  Spots: {session.enrolledStudentIds.length} / {session.maxStudents}
                </p>
              </div>

              <button
                disabled={isFull || alreadyJoined}
                onClick={() => joinSession(session.id)}
                className={`px-6 py-3 rounded-lg transition ${
                  isFull || alreadyJoined
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {alreadyJoined ? "Joined" : isFull ? "Session Full" : "Join Session"}
              </button>


            </div>
          );
        })}
      </div>
    </main>
  );
}
