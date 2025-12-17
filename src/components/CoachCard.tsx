import Link from "next/link";

export type TrainingLevel = "Beginner" | "Intermediate" | "Advanced";

type CoachCardProps = {
  id: string;
  name: string;
  game: string;
  levels: TrainingLevel[];
};

export default function CoachCard({
  id,
  name,
  game,
  levels,
}: CoachCardProps) {
  return (
    <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
      <h2 className="text-xl font-semibold">{name}</h2>

      <p className="text-gray-400 mt-2">{game}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {levels.map((level) => (
          <span
            key={level}
            className="px-3 py-1 text-xs rounded-full bg-gray-800 border border-gray-700"
          >
            {level}
          </span>
        ))}
      </div>

      <Link
        href={`/coaches/${id}`}
        className="inline-block mt-4 text-sm text-red-500 hover:underline"
      >
        View Profile
      </Link>
    </div>
  );
}
