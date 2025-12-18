"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core";

import { CoachProfile, generateSessionsFromAvailability } from "@/lib/scheduling";
import { WeeklyAvailabilityBlock, expandWeeklyAvailability } from "@/lib/availability";

const coachProfile: CoachProfile = {
  coachId: "alpha",
  name: "Coach Alpha",
  approvedGames: [
    { game: "Naraka: Bladepoint", maxTrainingLevel: "Intermediate" },
  ],
};

export default function CoachDashboardPage() {
  const [availability, setAvailability] = useState<WeeklyAvailabilityBlock[]>([]);
  const [pendingSelection, setPendingSelection] = useState<WeeklyAvailabilityBlock | null>(null);

  // Delete a block
  function deleteBlock(id: string) {
    if (confirm("Delete this availability block?")) {
      setAvailability((prev) => prev.filter((block) => block.id !== id));
    }
  }

  // Helper: convert "HH:MM" to minutes
  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  // Add or merge a new block
  function addOrCombineBlock(newBlock: WeeklyAvailabilityBlock) {
    let merged = false;
    const updated: WeeklyAvailabilityBlock[] = [];
    let blockToAdd = { ...newBlock };

    for (const block of availability) {
      if (block.dayOfWeek === blockToAdd.dayOfWeek) {
        const startA = timeToMinutes(block.startTime);
        const endA = timeToMinutes(block.endTime);
        const startB = timeToMinutes(blockToAdd.startTime);
        const endB = timeToMinutes(blockToAdd.endTime);

        // Merge if overlapping or adjacent
        if (!(endA < startB || startA > endB)) {
          merged = true;
          blockToAdd = {
            ...block,
            startTime: String(Math.floor(Math.min(startA, startB) / 60)).padStart(2, "0") + ":" + String(Math.min(startA, startB) % 60).padStart(2, "0"),
            endTime: String(Math.floor(Math.max(endA, endB) / 60)).padStart(2, "0") + ":" + String(Math.max(endA, endB) % 60).padStart(2, "0"),
            id: crypto.randomUUID(), // new ID for merged block
          };
        } else {
          updated.push(block);
        }
      } else {
        updated.push(block);
      }
    }

    setAvailability([...updated, blockToAdd]);
  }

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
    addOrCombineBlock(pendingSelection);
    setPendingSelection(null);
  }

  // Expand weekly availability into date-based availability
  const expandedAvailability = expandWeeklyAvailability(availability, coachProfile.coachId);

  // Generate sessions from expanded availability
  const sessions = generateSessionsFromAvailability(expandedAvailability, [coachProfile]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Weekly Availability</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable
          select={handleSelect}
          allDaySlot={false}
          height="auto"
          events={availability.map((block) => ({
            id: block.id,
            title: block.game,
            daysOfWeek: [block.dayOfWeek],
            startTime: block.startTime,
            endTime: block.endTime,
            extendedProps: { blockId: block.id },
          }))}
          eventClick={(info) => deleteBlock(info.event.extendedProps.blockId)}
        />
      </div>

      {pendingSelection && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Confirm Availability</h2>

          <div>
            <label className="block text-sm mb-1">Game</label>
            <select
              value={pendingSelection.game}
              onChange={(e) =>
                setPendingSelection({ ...pendingSelection, game: e.target.value })
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
            <label className="block text-sm mb-1">Max Students</label>
            <input
              type="number"
              min={1}
              value={pendingSelection.maxStudents}
              onChange={(e) =>
                setPendingSelection({ ...pendingSelection, maxStudents: Number(e.target.value) })
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

      {/* Show generated sessions */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Upcoming Sessions</h2>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-3 bg-gray-800 rounded-lg flex justify-between"
              >
                <span>
                  {session.date} {session.startTime}–{session.endTime} | {session.game} | {session.trainingLevel}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No sessions generated yet.</p>
        )}
      </div>
    </main>
  );
}
