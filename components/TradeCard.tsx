"use client";

import { getStickerById } from "@/lib/album-data";
import { ArrowLeftRight, Star } from "lucide-react";

type Priority = "green" | "orange" | "red";

interface Trade {
  withUser: { id: number; username: string };
  canGive: string[];
  canReceive: string[];
  canReceiveExclusive: string[];
  priority: Priority;
  exclusiveCount: number;
  alternativeSuppliers: Record<string, number>;
}

interface Props {
  trade: Trade;
}

const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  sublabel: string;
  icon: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  headerBg: string;
  avatarGradient: string;
}> = {
  green: {
    label: "Intercambio Único",
    sublabel: "Solo vos y él tienen estas figuritas — no hay nadie más en el grupo que pueda reemplazarlo",
    icon: "🟢",
    cardBorder: "border-green-600/60",
    badgeBg: "bg-green-500/20 border border-green-500/60",
    badgeText: "text-green-300",
    headerBg: "bg-green-900/20",
    avatarGradient: "from-green-500 to-emerald-600",
  },
  orange: {
    label: "Intercambio Posible",
    sublabel: "Algunas figuritas son exclusivas de este usuario, pero otras también las tienen otros del grupo",
    icon: "🟠",
    cardBorder: "border-amber-600/60",
    badgeBg: "bg-amber-500/20 border border-amber-500/60",
    badgeText: "text-amber-300",
    headerBg: "bg-amber-900/20",
    avatarGradient: "from-amber-500 to-orange-600",
  },
  red: {
    label: "Baja Prioridad",
    sublabel: "Todos los usuarios del grupo tienen estas figuritas disponibles — podés conseguirlas de cualquiera",
    icon: "🔴",
    cardBorder: "border-red-700/50",
    badgeBg: "bg-red-500/15 border border-red-600/50",
    badgeText: "text-red-300",
    headerBg: "bg-red-900/15",
    avatarGradient: "from-red-500 to-rose-600",
  },
};

function StickerPill({
  id,
  exclusive,
  alternatives,
}: {
  id: string;
  exclusive?: boolean;
  alternatives?: number;
}) {
  const info = getStickerById(id);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs whitespace-nowrap border ${
        exclusive
          ? "bg-green-900/30 border-green-600/60 text-green-200"
          : alternatives && alternatives > 1
          ? "bg-red-900/20 border-red-700/50 text-slate-300"
          : "bg-slate-700 border-slate-600 text-slate-300"
      }`}
      title={
        exclusive
          ? "★ Exclusivo: solo este usuario lo tiene para vos"
          : alternatives
          ? `${alternatives} usuario${alternatives !== 1 ? "s" : ""} más lo tiene`
          : undefined
      }
    >
      {exclusive && <Star size={9} className="text-green-400 fill-green-400 flex-shrink-0" />}
      <span>{info?.team.flag ?? "🏳️"}</span>
      <span className="font-mono font-bold">{id}</span>
      <span className="text-slate-400 truncate max-w-[80px]">{info?.def.name}</span>
      {alternatives !== undefined && alternatives > 0 && (
        <span className="text-slate-500 text-[10px]">×{alternatives + 1}</span>
      )}
    </span>
  );
}

export default function TradeCard({ trade }: Props) {
  const maxShow = 10;
  const cfg = PRIORITY_CONFIG[trade.priority];
  const exclusiveSet = new Set(trade.canReceiveExclusive);

  return (
    <div className={`rounded-xl border overflow-hidden transition ${cfg.cardBorder} bg-slate-800`}>
      {/* Priority header banner */}
      <div className={`${cfg.headerBg} px-4 py-2 flex items-center justify-between border-b ${cfg.cardBorder}`}>
        <div className="flex items-center gap-2">
          <span className="text-base">{cfg.icon}</span>
          <div>
            <span className={`text-sm font-bold ${cfg.badgeText}`}>{cfg.label}</span>
            <p className="text-slate-400 text-[11px] leading-tight mt-0.5 max-w-lg">{cfg.sublabel}</p>
          </div>
        </div>
        {trade.priority !== "red" && (
          <span className={`text-xs px-2 py-1 rounded-full ${cfg.badgeBg} ${cfg.badgeText} flex-shrink-0 ml-3`}>
            {trade.exclusiveCount} exclusiva{trade.exclusiveCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="p-4">
        {/* User row */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cfg.avatarGradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {trade.withUser.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">{trade.withUser.username}</p>
          </div>
          <div className="flex gap-2 text-xs text-slate-400">
            <span className="bg-blue-900/40 border border-blue-700/50 px-2 py-1 rounded">
              📤 {trade.canGive.length} das
            </span>
            <span className="bg-green-900/40 border border-green-700/50 px-2 py-1 rounded">
              📥 {trade.canReceive.length} recibís
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Can give */}
          <div>
            <p className="text-xs font-semibold text-blue-400 mb-2">
              📤 Vos le das{" "}
              <span className="text-slate-500 font-normal">(tus repetidas que a él le faltan)</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {trade.canGive.slice(0, maxShow).map((id) => (
                <StickerPill key={id} id={id} />
              ))}
              {trade.canGive.length > maxShow && (
                <span className="text-xs text-slate-500 self-center">
                  +{trade.canGive.length - maxShow} más
                </span>
              )}
            </div>
          </div>

          {/* Can receive */}
          <div>
            <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
              📥 Él te da{" "}
              <span className="text-slate-500 font-normal">(sus repetidas que a vos te faltan)</span>
              {trade.priority !== "red" && (
                <span className="ml-1 flex items-center gap-0.5 text-green-500">
                  <Star size={10} className="fill-green-500" />
                  <span className="text-[10px]">= exclusiva</span>
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-1">
              {trade.canReceive.slice(0, maxShow).map((id) => (
                <StickerPill
                  key={id}
                  id={id}
                  exclusive={exclusiveSet.has(id)}
                  alternatives={trade.alternativeSuppliers[id]}
                />
              ))}
              {trade.canReceive.length > maxShow && (
                <span className="text-xs text-slate-500 self-center">
                  +{trade.canReceive.length - maxShow} más
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2 text-xs text-slate-500">
          <ArrowLeftRight size={12} />
          Intercambio mutuo detectado automáticamente
        </div>
      </div>
    </div>
  );
}
