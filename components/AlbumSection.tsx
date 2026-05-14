"use client";

import { useState } from "react";
import { TeamDef } from "@/lib/album-data";
import StickerCard from "./StickerCard";
import { ChevronDown, ChevronRight } from "lucide-react";

type FilterType = "all" | "missing" | "have" | "repeated";

interface Props {
  team: TeamDef;
  collection: Record<string, number>;
  savingIds: Set<string>;
  onStickerChange: (stickerId: string, count: number) => void;
  defaultOpen?: boolean;
  filter?: FilterType;
}

export default function AlbumSection({
  team,
  collection,
  savingIds,
  onStickerChange,
  defaultOpen = false,
  filter = "all",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const teamTotal = team.stickers.length;
  const teamHave = team.stickers.filter((s) => (collection[s.id] ?? 0) >= 1).length;
  const teamRepeated = team.stickers.filter((s) => (collection[s.id] ?? 0) > 1).length;
  const teamComplete = teamHave === teamTotal;

  const progressPct = Math.round((teamHave / teamTotal) * 100);

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${
      teamComplete ? "border-green-600/50 bg-green-900/10" : "border-slate-700 bg-slate-800/50"
    }`}>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/40 transition text-left"
      >
        <span className="text-xl flex-shrink-0">{team.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm truncate">{team.name}</span>
            <span className="text-slate-500 text-xs font-mono">({team.id})</span>
            {teamComplete && (
              <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded font-semibold">✓ Completo</span>
            )}
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${teamComplete ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0 tabular-nums">
              {teamHave}/{teamTotal}
              {teamRepeated > 0 && (
                <span className="text-amber-400 ml-1">· {teamRepeated}R</span>
              )}
            </span>
          </div>
        </div>
        <span className="text-slate-400 flex-shrink-0">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>

      {/* Sticker grid */}
      {open && (
        <div className="px-4 pb-4 pt-1">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))" }}>
            {team.stickers.filter((s) => {
              if (filter === "missing") return (collection[s.id] ?? 0) === 0;
              if (filter === "have") return (collection[s.id] ?? 0) >= 1;
              if (filter === "repeated") return (collection[s.id] ?? 0) > 1;
              return true;
            }).map((sticker) => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                count={collection[sticker.id] ?? 0}
                onCountChange={(count) => onStickerChange(sticker.id, count)}
                saving={savingIds.has(sticker.id)}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-3 mt-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-slate-700 border border-slate-600 inline-block" />
              Me falta
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-600/30 border border-blue-500 inline-block" />
              La tengo
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-400 inline-block" />
              Repetida
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
