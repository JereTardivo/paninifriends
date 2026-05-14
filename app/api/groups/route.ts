import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = parseInt(session.user.id);

  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    include: {
      group: {
        include: {
          creator: { select: { id: true, username: true } },
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  const groups = memberships.map((m) => ({
    id: m.group.id,
    name: m.group.name,
    code: m.group.code,
    creatorId: m.group.creatorId,
    creatorUsername: m.group.creator.username,
    memberCount: m.group._count.members,
    isCreator: m.group.creatorId === userId,
    joinedAt: m.joinedAt,
  }));

  return NextResponse.json({ groups });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = parseInt(session.user.id);
  const { name, code, password } = await req.json();

  if (!name?.trim() || !code?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Nombre, código y contraseña son requeridos" }, { status: 400 });
  }

  const codeClean = code.trim().toUpperCase();

  const existing = await prisma.group.findUnique({ where: { code: codeClean } });
  if (existing) {
    return NextResponse.json({ error: "Ese código ya está en uso" }, { status: 409 });
  }

  const group = await prisma.group.create({
    data: {
      name: name.trim(),
      code: codeClean,
      password: password.trim(),
      creatorId: userId,
      members: { create: { userId } },
    },
  });

  return NextResponse.json({ group: { id: group.id, name: group.name, code: group.code } }, { status: 201 });
}
