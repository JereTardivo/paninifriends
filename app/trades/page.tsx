"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import TradeCard from "@/components/TradeCard";
import UserTradeDetail from "@/components/UserTradeDetail";
import { RefreshCw, ChevronDown, Users, Plus, LogIn, Settings, X, ChevronDown as ChevronDownIcon } from "lucide-react";

interface Trade {
  withUser: { id: number; username: string };
  canGive: string[];
  canReceive: string[];
  canReceiveExclusive: string[];
  priority: "green" | "orange" | "red";
  exclusiveCount: number;
  alternativeSuppliers: Record<string, number>;
}

interface GroupUser {
  id: number;
  username: string;
}

interface Group {
  id: number;
  name: string;
  code: string;
  creatorId: number;
  creatorUsername: string;
  memberCount: number;
  isCreator: boolean;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h3 className="font-bold text-white text-base">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function TradesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [users, setUsers] = useState<GroupUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<GroupUser | null>(null);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Groups
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("selectedGroupId");
    return saved ? parseInt(saved) : null;
  });
  const [groupMembers, setGroupMembers] = useState<GroupUser[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  function selectGroup(id: number | null) {
    setSelectedGroupId(id);
    if (id === null) localStorage.removeItem("selectedGroupId");
    else localStorage.setItem("selectedGroupId", String(id));
  }

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const loadTrades = useCallback(() => {
    setLoadingTrades(true);
    fetch("/api/trades")
      .then((r) => r.json())
      .then((data) => {
        setTrades(data.trades ?? []);
        setLoadingTrades(false);
      });
  }, []);

  const loadGroups = useCallback((keepSelected?: number) => {
    setLoadingGroups(true);
    fetch("/api/groups")
      .then((r) => r.json())
      .then((data) => {
        const fetched: Group[] = data.groups ?? [];
        setGroups(fetched);
        setLoadingGroups(false);
        // Restore saved selection only if group still exists
        const savedId = keepSelected ?? (() => {
          const s = localStorage.getItem("selectedGroupId");
          return s ? parseInt(s) : null;
        })();
        if (savedId !== null && fetched.some((g) => g.id === savedId)) {
          setSelectedGroupId(savedId);
        } else if (savedId !== null) {
          localStorage.removeItem("selectedGroupId");
          setSelectedGroupId(null);
        }
      })
      .catch(() => setLoadingGroups(false));
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    loadTrades();
    loadGroups();
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users ?? []);
        setLoadingUsers(false);
      });
  }, [status, loadTrades, loadGroups]);

  useEffect(() => {
    if (selectedGroupId === null) {
      setGroupMembers([]);
      return;
    }
    setLoadingMembers(true);
    setSelectedUser(null);
    fetch(`/api/groups/${selectedGroupId}/members`)
      .then((r) => r.json())
      .then((data) => {
        const others = (data.members ?? []).filter((m: GroupUser & { isMe?: boolean }) => !m.isMe);
        setGroupMembers(others);
        setLoadingMembers(false);
      });
  }, [selectedGroupId]);

  const displayUsers = selectedGroupId !== null ? groupMembers : users;
  const displayTrades = selectedGroupId !== null
    ? trades.filter((t) => groupMembers.some((m) => m.id === t.withUser.id))
    : trades;

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  function resetForm() {
    setFormName(""); setFormCode(""); setFormPassword(""); setFormError(""); setFormLoading(false);
  }

  async function handleCreate() {
    setFormError("");
    if (!formName.trim() || !formCode.trim() || !formPassword.trim()) {
      setFormError("Completá todos los campos"); return;
    }
    setFormLoading(true);
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, code: formCode, password: formPassword }),
    });
    const data = await res.json();
    if (!res.ok) { setFormError(data.error ?? "Error"); setFormLoading(false); return; }
    loadGroups(data.group.id);
    setShowCreate(false); resetForm();
  }

  async function handleJoin() {
    setFormError("");
    if (!formCode.trim() || !formPassword.trim()) {
      setFormError("Completá todos los campos"); return;
    }
    setFormLoading(true);
    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: formCode, password: formPassword }),
    });
    const data = await res.json();
    if (!res.ok) { setFormError(data.error ?? "Error"); setFormLoading(false); return; }
    loadGroups(data.group.id);
    setShowJoin(false); resetForm();
  }

  async function handleEdit() {
    if (!selectedGroup) return;
    setFormError("");
    setFormLoading(true);
    const body: Record<string, string> = {};
    if (formName.trim()) body.name = formName.trim();
    if (formCode.trim()) body.code = formCode.trim();
    if (formPassword.trim()) body.password = formPassword.trim();
    const res = await fetch(`/api/groups/${selectedGroup.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { setFormError(data.error ?? "Error"); setFormLoading(false); return; }
    loadGroups();
    setShowEdit(false); resetForm();
  }

  async function handleLeaveOrDelete() {
    if (!selectedGroup) return;
    const confirm = window.confirm(
      selectedGroup.isCreator
        ? `¿Eliminar el grupo "${selectedGroup.name}"? Se eliminará para todos los miembros.`
        : `¿Salir del grupo "${selectedGroup.name}"?`
    );
    if (!confirm) return;
    await fetch(`/api/groups/${selectedGroup.id}`, { method: "DELETE" });
    selectGroup(null);
    loadGroups();
  }

  const loading = loadingTrades || loadingUsers || loadingGroups;

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

        {/* ── GRUPOS ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">Mis Grupos</h2>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
            {/* Selector + actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Group dropdown */}
              <div className="relative">
                <select
                  value={selectedGroupId ?? ""}
                  onChange={(e) => selectGroup(e.target.value ? parseInt(e.target.value) : null)}
                  className="appearance-none pl-3 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">Sin grupo seleccionado</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.code}) · {g.memberCount}/10
                    </option>
                  ))}
                </select>
                <ChevronDownIcon size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Action buttons */}
              <button
                onClick={() => { resetForm(); setShowCreate(true); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
              >
                <Plus size={14} /> Crear grupo
              </button>
              <button
                onClick={() => { resetForm(); setShowJoin(true); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 text-sm font-medium rounded-lg transition"
              >
                <LogIn size={14} /> Unirse a grupo
              </button>

              {selectedGroup?.isCreator && (
                <button
                  onClick={() => { resetForm(); setFormName(selectedGroup.name); setFormCode(selectedGroup.code); setShowEdit(true); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 text-sm font-medium rounded-lg transition"
                >
                  <Settings size={14} /> Editar
                </button>
              )}
              {selectedGroup && (
                <button
                  onClick={handleLeaveOrDelete}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 text-sm font-medium rounded-lg transition"
                >
                  <X size={14} /> {selectedGroup.isCreator ? "Eliminar" : "Salir"}
                </button>
              )}
            </div>

            {/* Group info */}
            {selectedGroup && (
              <div className="text-xs text-slate-400 border-t border-slate-700 pt-2 flex flex-wrap gap-4">
                <span>📋 Código: <span className="font-mono text-white font-bold">{selectedGroup.code}</span></span>
                <span>👤 Creador: <span className="text-white">{selectedGroup.creatorUsername}</span></span>
                <span>👥 Miembros: <span className="text-white">{selectedGroup.memberCount}/10</span></span>
              </div>
            )}

            {groups.length === 0 && (
              <p className="text-slate-500 text-sm">No pertenecés a ningún grupo. Creá uno o unite con un código.</p>
            )}
          </div>
        </section>

        {/* ── CALCULAR INTERCAMBIO ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              Calcular intercambio con...
              {selectedGroup && <span className="text-slate-400 font-normal text-base ml-2">({selectedGroup.name})</span>}
            </h2>
          </div>

          {loadingMembers ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center text-slate-500 text-sm">
              {selectedGroupId !== null
                ? "No hay otros miembros en este grupo todavía. Compartí el código y contraseña para que se unan."
                : "No hay otros usuarios registrados todavía."}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {displayUsers.map((u) => {
                    const isSelected = selectedUser?.id === u.id;
                    const mutualTrade = displayTrades.find((t) => t.withUser.id === u.id);
                    const priorityColor =
                      mutualTrade?.priority === "green" ? "border-green-500 bg-green-900/20"
                      : mutualTrade?.priority === "orange" ? "border-amber-500 bg-amber-900/20"
                      : mutualTrade?.priority === "red" ? "border-red-600 bg-red-900/10"
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
                </p>
              </div>
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
                  <UserTradeDetail withUserId={selectedUser.id} withUsername={selectedUser.username} />
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-slate-600 text-sm">
                  ☝️ Seleccioná un usuario arriba para ver el detalle
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── INTERCAMBIOS AUTOMÁTICOS ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <h2 className="text-lg font-bold text-white">
                Intercambios mutuos detectados
                {selectedGroup && <span className="text-slate-400 font-normal text-base ml-2">({selectedGroup.name})</span>}
              </h2>
            </div>
            <button
              onClick={loadTrades}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition"
            >
              <RefreshCw size={14} /> Actualizar
            </button>
          </div>

          {displayTrades.length === 0 ? (
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
                    {displayTrades.length} usuario{displayTrades.length !== 1 ? "s" : ""} con intercambio mutuo posible
                  </p>
                  <p className="text-slate-400 text-xs">
                    Ordenados por prioridad: 🟢 únicos primero, luego 🟠 posibles y 🔴 baja prioridad
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {displayTrades.map((trade) => (
                  <TradeCard key={trade.withUser.id} trade={trade} />
                ))}
              </div>
            </>
          )}
        </section>

      </div>

      {/* ── MODAL CREAR GRUPO ── */}
      {showCreate && (
        <Modal title="Crear grupo" onClose={() => { setShowCreate(false); resetForm(); }}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nombre del grupo</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ej: Los Paninis" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Código único (para que otros se unan)</label>
              <input value={formCode} onChange={(e) => setFormCode(e.target.value.toUpperCase())} placeholder="Ej: AMIGOS2026" maxLength={20} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Contraseña</label>
              <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Contraseña del grupo" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            {formError && <p className="text-red-400 text-xs">{formError}</p>}
            <button onClick={handleCreate} disabled={formLoading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition">
              {formLoading ? "Creando..." : "Crear grupo"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── MODAL UNIRSE ── */}
      {showJoin && (
        <Modal title="Unirse a grupo" onClose={() => { setShowJoin(false); resetForm(); }}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Código del grupo</label>
              <input value={formCode} onChange={(e) => setFormCode(e.target.value.toUpperCase())} placeholder="Ej: AMIGOS2026" maxLength={20} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Contraseña</label>
              <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Contraseña del grupo" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            {formError && <p className="text-red-400 text-xs">{formError}</p>}
            <button onClick={handleJoin} disabled={formLoading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition">
              {formLoading ? "Uniéndose..." : "Unirse"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── MODAL EDITAR (creador) ── */}
      {showEdit && selectedGroup && (
        <Modal title="Editar grupo" onClose={() => { setShowEdit(false); resetForm(); }}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nombre del grupo</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Código único</label>
              <input value={formCode} onChange={(e) => setFormCode(e.target.value.toUpperCase())} maxLength={20} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nueva contraseña (dejar vacío para no cambiar)</label>
              <input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Nueva contraseña" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            {formError && <p className="text-red-400 text-xs">{formError}</p>}
            <button onClick={handleEdit} disabled={formLoading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition">
              {formLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
