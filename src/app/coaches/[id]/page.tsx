type TrainingLevel = "Beginner" | "Intermediate" | "Advanced";

const coaches = [
  {
    id: "alpha",
    name: "Coach Alpha",
    game: "Naraka: Bladepoint",
    levels: ["Beginner", "Intermediate"] as TrainingLevel[],
    bio: "Specializes in helping new players master movement and fundamentals.",
  },
  {
    id: "beta",
    name: "Coach Beta",
    game: "Naraka: Bladepoint",
    levels: ["Intermediate", "Advanced"] as TrainingLevel[],
    bio: "Focused on advanced weapon mastery and high-rank competitive play.",
  },
  {
    id: "gamma",
    name: "Coach Gamma",
    game: "Naraka: Bladepoint",
    levels: ["Beginner", "Intermediate", "Advanced"] as TrainingLevel[],
    bio: "Coaches players of all levels with a structured improvement system.",
  },
];

type CoachProfilePageProps = {
  params: {
    id: string;
  };
};

export default function CoachProfilePage({
  params,
}: CoachProfilePageProps) {
  const coach = coaches.find((c) => c.id === params.id);

  if (!coach) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Coach not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold">{coach.name}</h1>

      <p className="text-gray-400 mt-2">{coach.game}</p>

      <div className="mt-4 flex gap-2 flex-wrap">
        {coach.levels.map((level) => (
          <span
            key={level}
            className="px-3 py-1 text-xs rounded-full bg-gray-800 border border-gray-700"
          >
            {level}
          </span>
        ))}
      </div>

      <p className="mt-6 text-gray-300">{coach.bio}</p>

      <button className="mt-8 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition">
        Book a Session
      </button>
    </main>
  );
}
