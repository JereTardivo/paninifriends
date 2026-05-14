"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import TradeCard from "@/components/TradeCard";
import UserTradeDetail from "@/components/UserTradeDetail";
import { RefreshCw, ChevronDown, Users } from "lucide-react";

interface Trade {
  withUser: { id: number; username: string };
  canGive: string[];
  canReceive: string[];
  canReceiveExclusive: string[];
  priority: "green" | "orange" | "red";
  exclusiveCount: number;
  alternativeSuppliers: Record<string, number>;
}

interface User {
  id: number;
  username: string;
}

export default function TradesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  function loadTrades() {
    setLoadingTrades(true);
    fetch("/api/trades")
      .then((r) => r.json())
      .then((data) => {
        setTrades(data.trades ?? []);
        setLoadingTrades(false);
      });
  }

  useEffect(() => {
    if (status !== "authenticated") return;
    loadTrades();
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users ?? []);
        setLoadingUsers(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const loading = loadingTrades || loadingUsers;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Cargando intercambios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {/* ── SECCIÓN 1: Calcular con usuario específico ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">Calcular intercambio con...</h2>
          </div>

          {users.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center text-slate-500 text-sm">
              No hay otros usuarios registrados en el grupo todavía.
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              {/* User picker */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {users.map((u) => {
                    const isSelected = selectedUser?.id === u.id;
                    const mutualTrade = trades.find((t) => t.withUser.id === u.id);
                    const priorityColor =
                      mutualTrade?.priority === "green"
                        ? "border-green-500 bg-green-900/20"
                        : mutualTrade?.priority === "orange"
                        ? "border-amber-500 bg-amber-900/20"
                        : mutualTrade?.priority === "red"
                        ? "border-red-600 bg-red-900/10"
                        : "border-slate-600 bg-slate-700/50";

                    return (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUser(isSelected ? null : u)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-600/30 text-white shadow-lg shadow-blue-900/30"
                            : `${priorityColor} text-slate-300 hover:text-white hover:brightness-110`
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                          isSelected ? "bg-blue-500" : "bg-slate-600"
                        }`}>
                          {u.username[0].toUpperCase()}
                        </div>
                        {u.username}
                        {mutualTrade && (
                          <span className="text-[10px] opacity-70">
                            {mutualTrade.priority === "green" ? "🟢" : mutualTrade.priority === "orange" ? "🟠" : "🔴"}
                          </span>
                        )}
                        {isSelected && <ChevronDown size={14} className="text-blue-300" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  Seleccioná un usuario para ver en detalle qué pueden intercambiar.
                  {trades.length > 0 && " Los indicadores de color muestran la prioridad del intercambio mutuo detectado."}
                </p>
              </div>

              {/* Detail panel */}
              {selectedUser ? (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {selectedUser.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedUser.username}</p>
                      <p className="text-slate-500 text-xs">Intercambio calculado automáticamente</p>
                    </div>
                  </div>
                  <UserTradeDetail
                    withUserId={selectedUser.id}
                    withUsername={selectedUser.username}
                  />
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-slate-600 text-sm">
                  ☝️ Seleccioná un usuario arriba para ver el detalle
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── SECCIÓN 2: Intercambios automáticos ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <h2 className="text-lg font-bold text-white">Intercambios mutuos detectados</h2>
            </div>
            <button
              onClick={loadTrades}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition"
            >
              <RefreshCw size={14} />
              Actualizar
            </button>
          </div>

          {trades.length === 0 ? (
            <div className="text-center py-14 bg-slate-800/30 border border-slate-700 rounded-xl">
              <div className="text-5xl mb-3">🤝</div>
              <p className="text-white font-semibold mb-1">Sin intercambios mutuos disponibles</p>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Marcá más figuritas en tu álbum y asegurate de registrar las repetidas. Cuando haya una coincidencia mutua aparecerá acá.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 mb-4 flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {trades.length} usuario{trades.length !== 1 ? "s" : ""} con intercambio mutuo posible
                  </p>
                  <p className="text-slate-400 text-xs">
                    Ordenados por prioridad: 🟢 únicos primero, luego 🟠 posibles y 🔴 baja prioridad
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {trades.map((trade) => (
                  <TradeCard key={trade.withUser.id} trade={trade} />
                ))}
              </div>
            </>
          )}
        </section>

      </div>
    </div>
  );
}
