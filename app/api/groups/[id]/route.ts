import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = parseInt(session.user.id);
  const groupId = parseInt(params.id);

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });
  if (group.creatorId !== userId) return NextResponse.json({ error: "Solo el creador puede editar" }, { status: 403 });

  const { name, code, password } = await req.json();
  const updates: { name?: string; code?: string; password?: string } = {};

  if (name?.trim()) updates.name = name.trim();
  if (password?.trim()) updates.password = password.trim();
  if (code?.trim()) {
    const codeClean = code.trim().toUpperCase();
    const existing = await prisma.group.findUnique({ where: { code: codeClean } });
    if (existing && existing.id !== groupId) {
      return NextResponse.json({ error: "Ese código ya está en uso" }, { status: 409 });
    }
    updates.code = codeClean;
  }

  const updated = await prisma.group.update({ where: { id: groupId }, data: updates });
  return NextResponse.json({ group: { id: updated.id, name: updated.name, code: updated.code } });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = parseInt(session.user.id);
  const groupId = parseInt(params.id);

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });

  if (group.creatorId === userId) {
    await prisma.group.delete({ where: { id: groupId } });
    return NextResponse.json({ deleted: true });
  } else {
    await prisma.groupMember.delete({ where: { groupId_userId: { groupId, userId } } });
    return NextResponse.json({ left: true });
  }
}
