import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold text-white">
          The Dojo
        </Link>

        {/* Navigation */}
        <div className="flex gap-6 text-gray-300">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <Link href="/coaches" className="hover:text-white transition">
            Coaches
          </Link>
        </div>
      </div>
    </nav>
  );
}
