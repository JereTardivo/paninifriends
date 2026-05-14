import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALL_STICKERS } from "@/lib/album-data";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const myUserId = parseInt(session.user.id);

  const allUsers = await prisma.user.findMany({
    include: { stickers: true },
  });

  const me = allUsers.find((u) => u.id === myUserId);
  if (!me) return NextResponse.json({ trades: [] });

  const allStickerIds = Array.from(ALL_STICKERS.keys());

  // Build a collection map for every user once — avoids redundant loops
  const collectionsMap = new Map<number, Map<string, number>>();
  for (const user of allUsers) {
    const col = new Map<string, number>();
    for (const s of user.stickers) col.set(s.stickerId, s.count);
    collectionsMap.set(user.id, col);
  }

  const myCollection = collectionsMap.get(myUserId)!;

  const myMissing = new Set(allStickerIds.filter((id) => !myCollection.has(id)));
  const myRepeated = new Set(allStickerIds.filter((id) => (myCollection.get(id) ?? 0) > 1));

  const trades: {
    withUser: { id: number; username: string };
    canGive: string[];
    canReceive: string[];
    canReceiveExclusive: string[];
    priority: "green" | "orange" | "red";
    exclusiveCount: number;
    alternativeSuppliers: Record<string, number>;
  }[] = [];

  for (const otherUser of allUsers) {
    if (otherUser.id === myUserId) continue;

    const theirCollection = collectionsMap.get(otherUser.id)!;

    const theirMissing = new Set(allStickerIds.filter((id) => !theirCollection.has(id)));
    const theirRepeated = new Set(allStickerIds.filter((id) => (theirCollection.get(id) ?? 0) > 1));

    const canGive = allStickerIds.filter((id) => myRepeated.has(id) && theirMissing.has(id));
    const canReceive = allStickerIds.filter((id) => theirRepeated.has(id) && myMissing.has(id));

    if (canGive.length === 0 || canReceive.length === 0) continue;

    // For each sticker I can receive, count how many OTHER users (≠ me, ≠ partner)
    // also have it repeated AND I'm missing it  → alternative suppliers
    const alternativeSuppliers: Record<string, number> = {};
    for (const id of canReceive) {
      let count = 0;
      for (const u of allUsers) {
        if (u.id === myUserId || u.id === otherUser.id) continue;
        if ((collectionsMap.get(u.id)?.get(id) ?? 0) > 1) count++;
      }
      alternativeSuppliers[id] = count;
    }

    const canReceiveExclusive = canReceive.filter((id) => alternativeSuppliers[id] === 0);
    const exclusiveRatio = canReceive.length > 0 ? canReceiveExclusive.length / canReceive.length : 0;

    let priority: "green" | "orange" | "red";
    if (exclusiveRatio === 1) {
      priority = "green";   // Único: nadie más tiene estas figuritas para mí
    } else if (exclusiveRatio > 0) {
      priority = "orange";  // Posible: algunas son exclusivas, otras no
    } else {
      priority = "red";     // Bajo: todos los usuarios tienen estas figuritas
    }

    trades.push({
      withUser: { id: otherUser.id, username: otherUser.username },
      canGive,
      canReceive,
      canReceiveExclusive,
      priority,
      exclusiveCount: canReceiveExclusive.length,
      alternativeSuppliers,
    });
  }

  // Sort: green first → orange → red, then by min(give, receive) desc
  const priorityOrder: Record<string, number> = { green: 0, orange: 1, red: 2 };
  trades.sort((a, b) => {
    const po = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (po !== 0) return po;
    return (
      Math.min(b.canGive.length, b.canReceive.length) -
      Math.min(a.canGive.length, a.canReceive.length)
    );
  });

  return NextResponse.json({ trades });
}
