import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = parseInt(session.user.id);
  const { code, password } = await req.json();

  if (!code?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Código y contraseña requeridos" }, { status: 400 });
  }

  const group = await prisma.group.findUnique({
    where: { code: code.trim().toUpperCase() },
    include: { _count: { select: { members: true } } },
  });

  if (!group) return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });
  if (group.password !== password.trim()) return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 403 });
  if (group._count.members >= 10) return NextResponse.json({ error: "El grupo está lleno (máx. 10)" }, { status: 409 });

  const existing = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId } },
  });
  if (existing) return NextResponse.json({ error: "Ya sos miembro de este grupo" }, { status: 409 });

  await prisma.groupMember.create({ data: { groupId: group.id, userId } });

  return NextResponse.json({ group: { id: group.id, name: group.name, code: group.code } });
}
