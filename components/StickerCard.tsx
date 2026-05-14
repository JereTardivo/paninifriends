"use client";

import { StickerDef } from "@/lib/album-data";

interface Props {
  sticker: StickerDef;
  count: number;
  onCountChange: (newCount: number) => void;
  saving?: boolean;
}

export default function StickerCard({ sticker, count, onCountChange, saving }: Props) {
  const isMissing = count === 0;
  const isHave = count === 1;
  const isRepeated = count > 1;

  function handleClick() {
    if (isMissing) {
      onCountChange(1);
    } else {
      onCountChange(0);
    }
  }

  function handleAddRepeat(e: React.MouseEvent) {
    e.stopPropagation();
    onCountChange(count + 1);
  }

  function handleRemoveRepeat(e: React.MouseEvent) {
    e.stopPropagation();
    onCountChange(Math.max(0, count - 1));
  }

  return (
    <div
      className={`relative group flex flex-col items-center justify-center rounded-lg cursor-pointer select-none transition-all duration-150 border text-center
        ${saving ? "opacity-60" : ""}
        ${isMissing
          ? "bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-400 hover:bg-slate-650"
          : isRepeated
          ? "bg-amber-500/20 border-amber-400 text-amber-200 hover:bg-amber-500/30"
          : "bg-blue-600/30 border-blue-500 text-blue-100 hover:bg-blue-600/40"
        }
      `}
      style={{ minWidth: 0, padding: "6px 4px", minHeight: "64px" }}
      onClick={handleClick}
      title={`${sticker.id} - ${sticker.name}`}
    >
      {/* Sticker ID */}
      <span className="text-[10px] font-bold opacity-70 leading-none mb-0.5">
        {sticker.id}
      </span>

      {/* Name */}
      <span className="text-[10px] leading-tight font-medium px-0.5 line-clamp-2 max-w-full">
        {sticker.name}
      </span>

      {/* Repeated badge */}
      {isRepeated && (
        <span className="absolute top-0.5 right-0.5 bg-amber-500 text-amber-950 text-[9px] font-black rounded px-1 leading-none py-0.5">
          +{count - 1}
        </span>
      )}

      {/* Repeat controls (visible on hover when have >= 1) */}
      {!isMissing && (
        <div className="absolute bottom-0 left-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleRemoveRepeat}
            className="flex-1 bg-slate-900/80 hover:bg-red-600/60 text-white text-xs rounded-bl-lg py-0.5 transition font-bold"
            title="Quitar una"
          >
            −
          </button>
          <button
            onClick={handleAddRepeat}
            className="flex-1 bg-slate-900/80 hover:bg-green-600/60 text-white text-xs rounded-br-lg py-0.5 transition font-bold"
            title="Agregar repetida"
          >
            +
          </button>
        </div>
      )}

      {/* Check mark for owned */}
      {isHave && (
        <span className="absolute top-0.5 right-0.5 text-[10px] text-blue-300 font-bold leading-none">✓</span>
      )}
    </div>
  );
}
