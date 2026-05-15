import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const requestingUserId = parseInt(session.user.id);
  const groupId = parseInt(params.id);
  const targetUserId = parseInt(params.userId);

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });
  if (group.creatorId !== requestingUserId)
    return NextResponse.json({ error: "Solo el admin puede eliminar miembros" }, { status: 403 });
  if (targetUserId === requestingUserId)
    return NextResponse.json({ error: "No podés eliminarte a vos mismo" }, { status: 400 });

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: targetUserId } },
  });
  if (!membership) return NextResponse.json({ error: "El usuario no es miembro" }, { status: 404 });

  await prisma.groupMember.delete({
    where: { groupId_userId: { groupId, userId: targetUserId } },
  });

  return NextResponse.json({ ok: true });
}
