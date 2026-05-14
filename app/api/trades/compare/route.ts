import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALL_STICKERS } from "@/lib/album-data";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const myUserId = parseInt(session.user.id);
  const { searchParams } = new URL(req.url);
  const withUserId = parseInt(searchParams.get("withUserId") ?? "0");

  if (!withUserId) {
    return NextResponse.json({ error: "withUserId requerido" }, { status: 400 });
  }

  const allUsers = await prisma.user.findMany({
    include: { stickers: { select: { stickerId: true, count: true } } },
  });

  const me = allUsers.find((u) => u.id === myUserId);
  const otherUser = allUsers.find((u) => u.id === withUserId);

  if (!me || !otherUser) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const allStickerIds = Array.from(ALL_STICKERS.keys());

  // Build collections map for all users once
  const collectionsMap = new Map<number, Map<string, number>>();
  for (const user of allUsers) {
    const col = new Map<string, number>();
    for (const s of user.stickers) col.set(s.stickerId, s.count);
    collectionsMap.set(user.id, col);
  }

  const myCollection = collectionsMap.get(myUserId)!;
  const theirCollection = collectionsMap.get(withUserId)!;

  const myMissing = new Set(allStickerIds.filter((id) => !myCollection.has(id)));
  const myRepeated = new Set(allStickerIds.filter((id) => (myCollection.get(id) ?? 0) > 1));
  const theirMissing = new Set(allStickerIds.filter((id) => !theirCollection.has(id)));
  const theirRepeated = new Set(allStickerIds.filter((id) => (theirCollection.get(id) ?? 0) > 1));

  const canGive = allStickerIds.filter((id) => myRepeated.has(id) && theirMissing.has(id));
  const canReceive = allStickerIds.filter((id) => theirRepeated.has(id) && myMissing.has(id));

  // Exclusivity: for each canReceive sticker, how many OTHER users can also supply it?
  const alternativeSuppliers: Record<string, number> = {};
  for (const id of canReceive) {
    let count = 0;
    for (const u of allUsers) {
      if (u.id === myUserId || u.id === withUserId) continue;
      if ((collectionsMap.get(u.id)?.get(id) ?? 0) > 1) count++;
    }
    alternativeSuppliers[id] = count;
  }

  const canReceiveExclusive = canReceive.filter((id) => alternativeSuppliers[id] === 0);
  const exclusiveRatio = canReceive.length > 0 ? canReceiveExclusive.length / canReceive.length : 0;

  let priority: "green" | "orange" | "red" | "none";
  if (canGive.length === 0 || canReceive.length === 0) {
    priority = "none";
  } else if (exclusiveRatio === 1) {
    priority = "green";
  } else if (exclusiveRatio > 0) {
    priority = "orange";
  } else {
    priority = "red";
  }

  return NextResponse.json({
    withUser: { id: otherUser.id, username: otherUser.username },
    canGive,
    canReceive,
    canReceiveExclusive,
    priority,
    exclusiveCount: canReceiveExclusive.length,
    alternativeSuppliers,
    isMutual: canGive.length > 0 && canReceive.length > 0,
  });
}
