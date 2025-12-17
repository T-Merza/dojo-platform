import CoachCard, { TrainingLevel } from "@/components/CoachCard";

const coaches: {
  id: string;
  name: string;
  game: string;
  levels: TrainingLevel[];
}[] = [
  {
    id: "alpha",
    name: "Coach Alpha",
    game: "Naraka: Bladepoint",
    levels: ["Beginner", "Intermediate"],
  },
  {
    id: "beta",
    name: "Coach Beta",
    game: "Naraka: Bladepoint",
    levels: ["Intermediate", "Advanced"],
  },
  {
    id: "gamma",
    name: "Coach Gamma",
    game: "Naraka: Bladepoint",
    levels: ["Beginner", "Intermediate", "Advanced"],
  },
];

export default function CoachesPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        Find a Coach
      </h1>

      <p className="text-gray-400 mb-10 max-w-2xl">
        Browse experienced Naraka: Bladepoint coaches and book
        free or paid training sessions.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} {...coach} />
        ))}
      </div>
    </main>
  );
}
