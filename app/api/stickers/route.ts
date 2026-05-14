import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const stickers = await prisma.userSticker.findMany({
    where: { userId },
    select: { stickerId: true, count: true },
  });

  const result: Record<string, number> = {};
  for (const s of stickers) {
    result[s.stickerId] = s.count;
  }

  return NextResponse.json({ stickers: result });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const body = await req.json();
  const { stickerId, count } = body as { stickerId: string; count: number };

  if (!stickerId || count === undefined) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  if (count <= 0) {
    await prisma.userSticker.deleteMany({ where: { userId, stickerId } });
  } else {
    await prisma.userSticker.upsert({
      where: { userId_stickerId: { userId, stickerId } },
      update: { count },
      create: { userId, stickerId, count },
    });
  }

  return NextResponse.json({ ok: true });
}
