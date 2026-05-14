"use client";

import { useEffect, useState } from "react";
import { getStickerById } from "@/lib/album-data";
import { Star, ArrowLeftRight, AlertCircle } from "lucide-react";

type Priority = "green" | "orange" | "red" | "none";

interface CompareResult {
  withUser: { id: number; username: string };
  canGive: string[];
  canReceive: string[];
  canReceiveExclusive: string[];
  priority: Priority;
  exclusiveCount: number;
  alternativeSuppliers: Record<string, number>;
  isMutual: boolean;
}

interface Props {
  withUserId: number;
  withUsername: string;
}

const PRIORITY_META: Record<Exclude<Priority, "none">, { label: string; icon: string; color: string }> = {
  green:  { label: "Intercambio Único",    icon: "🟢", color: "text-green-400" },
  orange: { label: "Intercambio Posible",  icon: "🟠", color: "text-amber-400" },
  red:    { label: "Baja Prioridad",       icon: "🔴", color: "text-red-400"   },
};

function StickerRow({ id, exclusive, alternatives }: { id: string; exclusive?: boolean; alternatives?: number }) {
  const info = getStickerById(id);
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${
      exclusive
        ? "bg-green-900/25 border-green-700/50"
        : alternatives && alternatives > 1
        ? "bg-red-900/15 border-red-800/40"
        : "bg-slate-700/50 border-slate-600/50"
    }`}>
      {exclusive && <Star size={11} className="text-green-400 fill-green-400 flex-shrink-0" />}
      <span className="text-base leading-none flex-shrink-0">{info?.team.flag ?? "🏳️"}</span>
      <span className="font-mono font-bold text-xs text-slate-300 flex-shrink-0">{id}</span>
      <span className="text-slate-300 text-xs truncate flex-1">{info?.def.name}</span>
      {alternatives !== undefined && alternatives > 0 && (
        <span className="text-slate-500 text-[10px] flex-shrink-0 ml-auto">
          +{alternatives} alt.
        </span>
      )}
    </div>
  );
}

export default function UserTradeDetail({ withUserId, withUsername }: Props) {
  const [data, setData] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError("");

    fetch(`/api/trades/compare?withUserId=${withUserId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setData(res);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar");
        setLoading(false);
      });
  }, [withUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mr-3" />
        <span className="text-slate-400 text-sm">Calculando intercambio con {withUsername}...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm py-6 justify-center">
        <AlertCircle size={16} />
        {error || "No se pudo cargar"}
      </div>
    );
  }

  const exclusiveSet = new Set(data.canReceiveExclusive);
  const priorityMeta = data.priority !== "none" ? PRIORITY_META[data.priority] : null;

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {data.isMutual && priorityMeta ? (
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${priorityMeta.color}`}>
            <span>{priorityMeta.icon}</span>
            {priorityMeta.label}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <ArrowLeftRight size={14} />
            {data.canGive.length === 0 && data.canReceive.length === 0
              ? "Sin intercambio posible entre ustedes"
              : "Intercambio parcial — solo un lado puede dar"}
          </span>
        )}
        <div className="flex gap-2 ml-auto">
          <span className="bg-blue-900/40 border border-blue-700/50 px-2 py-1 rounded text-xs text-slate-300">
            📤 {data.canGive.length} ofrezco
          </span>
          <span className="bg-green-900/40 border border-green-700/50 px-2 py-1 rounded text-xs text-slate-300">
            📥 {data.canReceive.length} quiero
          </span>
          {data.exclusiveCount > 0 && (
            <span className="bg-green-900/40 border border-green-600/50 px-2 py-1 rounded text-xs text-green-300 flex items-center gap-1">
              <Star size={10} className="fill-green-400 text-green-400" />
              {data.exclusiveCount} exclusiva{data.exclusiveCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* LEFT — Lo que ofrezco */}
        <div className="bg-slate-800/60 border border-blue-700/30 rounded-xl overflow-hidden">
          <div className="bg-blue-900/30 border-b border-blue-700/30 px-4 py-2.5">
            <p className="text-blue-300 font-semibold text-sm flex items-center gap-1.5">
              📤 Lo que yo ofrezco
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Mis figuritas repetidas que a <strong className="text-slate-400">{withUsername}</strong> le faltan
            </p>
          </div>
          <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin">
            {data.canGive.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                No tenés repetidas que le falten a {withUsername}
              </p>
            ) : (
              <div className="space-y-1">
                {data.canGive.map((id) => (
                  <StickerRow key={id} id={id} />
                ))}
              </div>
            )}
          </div>
          {data.canGive.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-700 bg-slate-800/80">
              <span className="text-xs text-slate-500">{data.canGive.length} figurita{data.canGive.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {/* RIGHT — Lo que quiero recibir */}
        <div className="bg-slate-800/60 border border-green-700/30 rounded-xl overflow-hidden">
          <div className="bg-green-900/20 border-b border-green-700/30 px-4 py-2.5">
            <p className="text-green-300 font-semibold text-sm flex items-center gap-1.5">
              📥 Lo que quiero recibir
              {data.exclusiveCount > 0 && (
                <span className="ml-2 text-[10px] text-green-500 flex items-center gap-0.5 font-normal">
                  <Star size={9} className="fill-green-500" /> = solo él la tiene
                </span>
              )}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Las repetidas de <strong className="text-slate-400">{withUsername}</strong> que a mí me faltan
            </p>
          </div>
          <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin">
            {data.canReceive.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                {withUsername} no tiene repetidas que te falten a vos
              </p>
            ) : (
              <div className="space-y-1">
                {data.canReceive.map((id) => (
                  <StickerRow
                    key={id}
                    id={id}
                    exclusive={exclusiveSet.has(id)}
                    alternatives={data.alternativeSuppliers[id]}
                  />
                ))}
              </div>
            )}
          </div>
          {data.canReceive.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-700 bg-slate-800/80">
              <span className="text-xs text-slate-500">{data.canReceive.length} figurita{data.canReceive.length !== 1 ? "s" : ""}</span>
              {data.exclusiveCount > 0 && (
                <span className="text-xs text-green-500 ml-2">· {data.exclusiveCount} exclusiva{data.exclusiveCount !== 1 ? "s" : ""} ★</span>
              )}
            </div>
          )}
        </div>
      </div>

      {!data.isMutual && (data.canGive.length > 0 || data.canReceive.length > 0) && (
        <p className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
          <AlertCircle size={12} />
          Este intercambio no es completamente mutuo — un lado no tiene nada para ofrecer al otro.
        </p>
      )}
    </div>
  );
}
