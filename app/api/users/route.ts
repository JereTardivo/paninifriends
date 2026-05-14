import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const myUserId = parseInt(session.user.id);

  const users = await prisma.user.findMany({
    where: { id: { not: myUserId } },
    select: { id: true, username: true },
    orderBy: { username: "asc" },
  });

  return NextResponse.json({ users });
}
