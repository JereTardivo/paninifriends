"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, BookOpen, ArrowLeftRight } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand */}
        <Link href="/album" className="flex items-center gap-2 font-bold text-white text-lg">
          <span className="text-xl">⚽</span>
          <span>Panini<span className="text-yellow-400">Friends</span></span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/album"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              pathname === "/album"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <BookOpen size={15} />
            Mi Álbum
          </Link>
          <Link
            href="/trades"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              pathname === "/trades"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ArrowLeftRight size={15} />
            Intercambios
          </Link>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:block">
            👤 <span className="text-white font-medium">{session.user?.name}</span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition text-sm px-2 py-1.5 rounded-lg hover:bg-slate-800"
            title="Cerrar sesión"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
