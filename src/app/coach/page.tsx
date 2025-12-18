"use client";

import { useState } from "react";
import {
  CoachAvailability,
  TrainingLevel,
  CoachProfile,
  generateSessionsFromAvailability,
} from "@/lib/scheduling";

export default function CoachDashboardPage() {
  const [availability, setAvailability] = useState<CoachAvailability[]>([]);

  const [form, setForm] = useState({
    coachId: "alpha",
    coachName: "Coach Alpha",
    game: "Naraka: Bladepoint",
    trainingLevels: [] as TrainingLevel[],
    date: "",
    startTime: "",
    endTime: "",
    maxStudents: 5,
  });

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

  function toggleLevel(level: TrainingLevel) {
    setForm((prev) => ({
      ...prev,
      trainingLevels: prev.trainingLevels.includes(level)
        ? prev.trainingLevels.filter((l) => l !== level)
        : [...prev.trainingLevels, level],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setAvailability((prev) => [...prev, form]);

    setForm((prev) => ({
      ...prev,
      trainingLevels: [],
      date: "",
      startTime: "",
      endTime: "",
    }));
  }

  const sessions = generateSessionsFromAvailability(availability, coaches);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Coach Availability</h1>

      {/* Availability Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-10"
      >
        <div>
          <label className="block text-sm mb-1">Game</label>
          <input
            value={form.game}
            onChange={(e) =>
              setForm({ ...form, game: e.target.value })
            }
            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2"
          />
        </div>            {/* Game Selection Will Be Admin-Approved in Future Versions */}                                                                                         
                
        <div>
          <label className="block text-sm mb-2">
            Training Levels
          </label>
          <div className="flex gap-4">
            {["Beginner", "Intermediate", "Advanced"].map(
              (level) => (
                <label
                  key={level}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={form.trainingLevels.includes(
                      level as TrainingLevel
                    )}
                    onChange={() =>
                      toggleLevel(level as TrainingLevel)
                    }
                  />
                  {level}
                </label>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  startTime: e.target.value,
                })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              End Time
            </label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  endTime: e.target.value,
                })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">
            Max Students
          </label>
          <input
            type="number"
            value={form.maxStudents}
            min={1}
            onChange={(e) =>
              setForm({
                ...form,
                maxStudents: Number(e.target.value),
              })
            }
            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2"
          />
        </div>

        <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg">
          Add Availability
        </button>
      </form>

      {/* Generated Sessions Preview */}
      <h2 className="text-2xl font-semibold mb-4">
        Generated Sessions
      </h2>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 bg-gray-900 border border-gray-800 rounded-lg"
          >
            {session.date} {session.startTime}–{session.endTime} |{" "}
            {session.game} | {session.trainingLevel}
          </div>
        ))}

        {sessions.length === 0 && (
          <p className="text-gray-500">
            No sessions generated yet.
          </p>
        )}
      </div>
    </main>
  );
}
