import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALL_STICKERS } from "@/lib/album-data";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = parseInt(session.user.id);
  const groupId = parseInt(params.id);

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!membership) return NextResponse.json({ error: "No pertenecés a este grupo" }, { status: 403 });

  const members = await prisma.groupMember.findMany({
    where: { groupId },
    include: { user: { include: { stickers: true } } },
    orderBy: { joinedAt: "asc" },
  });

  const allStickerIds = Array.from(ALL_STICKERS.keys());

  const result = members.map((m) => {
    const col = new Map<string, number>();
    for (const s of m.user.stickers) col.set(s.stickerId, s.count);

    const missing = allStickerIds.filter((id) => !col.has(id));
    const repeated = allStickerIds.filter((id) => (col.get(id) ?? 0) > 1);

    return {
      id: m.user.id,
      username: m.user.username,
      isMe: m.user.id === userId,
      totalHave: col.size,
      missing,
      repeated,
    };
  });

  return NextResponse.json({ members: result });
}
