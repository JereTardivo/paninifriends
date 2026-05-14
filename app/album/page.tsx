"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import AlbumSection from "@/components/AlbumSection";
import { CONFEDERATIONS, GROUPS, ALL_TEAMS, TOTAL_STICKERS } from "@/lib/album-data";
import { Search, X, LayoutList, Grid2x2 } from "lucide-react";

type FilterType = "all" | "missing" | "have" | "repeated";

export default function AlbumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [collection, setCollection] = useState<Record<string, number>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"confederation" | "groups">("confederation");

  const pendingSaves = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/stickers")
        .then((r) => r.json())
        .then((data) => {
          setCollection(data.stickers ?? {});
          setLoading(false);
        });
    }
  }, [status]);

  const handleStickerChange = useCallback(
    (stickerId: string, count: number) => {
      setCollection((prev) => {
        const next = { ...prev };
        if (count <= 0) {
          delete next[stickerId];
        } else {
          next[stickerId] = count;
        }
        return next;
      });

      setSavingIds((prev) => new Set(prev).add(stickerId));

      if (pendingSaves.current.has(stickerId)) {
        clearTimeout(pendingSaves.current.get(stickerId)!);
      }

      const timer = setTimeout(async () => {
        await fetch("/api/stickers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stickerId, count }),
        });
        setSavingIds((prev) => {
          const next = new Set(prev);
          next.delete(stickerId);
          return next;
        });
        pendingSaves.current.delete(stickerId);
      }, 500);

      pendingSaves.current.set(stickerId, timer);
    },
    []
  );

  const totalHave = Object.keys(collection).length;
  const totalMissing = TOTAL_STICKERS - totalHave;
  const totalRepeated = Object.values(collection).filter((c) => c > 1).length;
  const totalForTrade = Object.values(collection).reduce(
    (acc, c) => acc + Math.max(0, c - 1),
    0
  );
  const pct = Math.round((totalHave / TOTAL_STICKERS) * 100);

  const searchLower = search.toLowerCase();

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Cargando álbum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            Mi Álbum — <span className="text-yellow-400">Mundial 2026</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Hacé clic en una figurita para marcarla. Usá los botones +/− para agregar repetidas.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Completadas", value: totalHave, total: TOTAL_STICKERS, color: "text-blue-400", bg: "bg-blue-900/20 border-blue-800/50" },
            { label: "Me faltan", value: totalMissing, total: TOTAL_STICKERS, color: "text-red-400", bg: "bg-red-900/20 border-red-800/50" },
            { label: "Repetidas", value: totalRepeated, total: null, color: "text-amber-400", bg: "bg-amber-900/20 border-amber-800/50" },
            { label: "Para cambiar", value: totalForTrade, total: null, color: "text-green-400", bg: "bg-green-900/20 border-green-800/50" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border p-3 ${stat.bg}`}>
              <p className="text-slate-400 text-xs">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
                {stat.total !== null && (
                  <span className="text-sm text-slate-500 font-normal ml-1">/ {stat.total}</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progreso total</span>
            <span className="font-bold text-white">{pct}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Filters + Search + View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 flex-wrap">
            {(["all", "missing", "have", "repeated"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {f === "all" ? "Todas" : f === "missing" ? "Me faltan" : f === "have" ? "Las tengo" : "Repetidas"}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-0 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar selección..."
              className="w-full pl-8 pr-8 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {/* View mode toggle */}
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => setViewMode("confederation")}
              title="Por Confederación"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                viewMode === "confederation"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              <LayoutList size={14} />
              Confederación
            </button>
            <button
              onClick={() => setViewMode("groups")}
              title="Por Grupos"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                viewMode === "groups"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Grid2x2 size={14} />
              Grupos
            </button>
          </div>
        </div>

        {/* Album sections */}
        <div className="space-y-6">
          {viewMode === "confederation" ? (
            <>
              {CONFEDERATIONS.map((conf) => {
                const teamsToShow = conf.teams.filter((team) => {
                  if (searchLower && !team.name.toLowerCase().includes(searchLower) && !team.id.toLowerCase().includes(searchLower)) return false;
                  if (filter === "missing") return team.stickers.some((s) => !collection[s.id]);
                  if (filter === "have") return team.stickers.some((s) => (collection[s.id] ?? 0) >= 1);
                  if (filter === "repeated") return team.stickers.some((s) => (collection[s.id] ?? 0) > 1);
                  return true;
                });
                if (teamsToShow.length === 0) return null;
                return (
                  <div key={conf.id}>
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      {conf.name}
                      <span className="text-slate-600 normal-case font-normal tracking-normal">
                        ({teamsToShow.length} selecciones)
                      </span>
                    </h2>
                    <div className="space-y-2">
                      {teamsToShow.map((team) => (
                        <AlbumSection
                          key={team.id}
                          team={team}
                          collection={collection}
                          savingIds={savingIds}
                          onStickerChange={handleStickerChange}
                          defaultOpen={conf.id === "ESPECIAL"}
                          filter={filter}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {GROUPS.map((group) => {
                const teamsToShow = group.teamIds
                  .map((id) => ALL_TEAMS.get(id))
                  .filter((team): team is NonNullable<typeof team> => {
                    if (!team) return false;
                    if (searchLower && !team.name.toLowerCase().includes(searchLower) && !team.id.toLowerCase().includes(searchLower)) return false;
                    if (filter === "missing") return team.stickers.some((s) => !collection[s.id]);
                    if (filter === "have") return team.stickers.some((s) => (collection[s.id] ?? 0) >= 1);
                    if (filter === "repeated") return team.stickers.some((s) => (collection[s.id] ?? 0) > 1);
                    return true;
                  });
                if (teamsToShow.length === 0) return null;
                return (
                  <div key={group.id}>
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      {group.name}
                      <span className="text-slate-600 normal-case font-normal tracking-normal">
                        ({teamsToShow.length} selecciones)
                      </span>
                    </h2>
                    <div className="space-y-2">
                      {teamsToShow.map((team) => (
                        <AlbumSection
                          key={team.id}
                          team={team}
                          collection={collection}
                          savingIds={savingIds}
                          onStickerChange={handleStickerChange}
                          defaultOpen={false}
                          filter={filter}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
