"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core";

import { CoachProfile } from "@/lib/scheduling";
import { WeeklyAvailabilityBlock } from "@/lib/availability";

const coachProfile: CoachProfile = {
  coachId: "alpha",
  name: "Coach Alpha",
  approvedGames: [
    {
      game: "Naraka: Bladepoint",
      maxTrainingLevel: "Intermediate",
    },
  ],
};

export default function CoachDashboardPage() {
  const [availability, setAvailability] = useState<
    WeeklyAvailabilityBlock[]
  >([]);

  const [pendingSelection, setPendingSelection] =
    useState<WeeklyAvailabilityBlock | null>(null);

  function handleSelect(info: DateSelectArg) {
    const start = info.start;
    const end = info.end;

    setPendingSelection({
      id: crypto.randomUUID(),
      dayOfWeek: start.getDay(),
      startTime: start.toTimeString().slice(0, 5),
      endTime: end.toTimeString().slice(0, 5),
      game: coachProfile.approvedGames[0].game,
      maxStudents: 5,
    });
  }

  function confirmAvailability() {
    if (!pendingSelection) return;
    setAvailability((prev) => [...prev, pendingSelection]);
    setPendingSelection(null);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Weekly Availability
      </h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable
          select={handleSelect}
          allDaySlot={false}
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
          height="auto"
          events={availability.map((block) => ({
            id: block.id,
            title: block.game,
            daysOfWeek: [block.dayOfWeek],
            startTime: block.startTime,
            endTime: block.endTime,
          }))}
        />
      </div>

      {pendingSelection && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Confirm Availability
          </h2>

          <div>
            <label className="block text-sm mb-1">Game</label>
            <select
              value={pendingSelection.game}
              onChange={(e) =>
                setPendingSelection({
                  ...pendingSelection,
                  game: e.target.value,
                })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2"
            >
              {coachProfile.approvedGames.map((g) => (
                <option key={g.game} value={g.game}>
                  {g.game}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Max Students
            </label>
            <input
              type="number"
              min={1}
              value={pendingSelection.maxStudents}
              onChange={(e) =>
                setPendingSelection({
                  ...pendingSelection,
                  maxStudents: Number(e.target.value),
                })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2"
            />
          </div>

          <button
            onClick={confirmAvailability}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg"
          >
            Confirm Weekly Block
          </button>
        </div>
      )}
    </main>
  );
}
