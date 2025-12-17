import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-center">
        The Dojo
      </h1>

    <p className="mt-4 text-lg md:text-xl text-center text-gray-300 max-w-xl">
      Train with top Naraka: Bladepoint coaches. Improve your skills. Compete at a higher level.
    </p>


      <div className="mt-8 flex gap-4">
        <Link
          href="/coaches"
          className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          Find a Coach
        </Link>

        <Link
          href="/register"
          className="px-6 py-3 rounded-lg border border-gray-500 hover:bg-gray-800 transition"
        >
          Become a Coach
        </Link>
      </div>
    </main>
  );
}
