// app/api/administradores/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Obtener todos los administradores
export async function GET() {
  try {
    const administradores = await prisma.administrador.findMany();
    return NextResponse.json(administradores);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener administradores" },
      { status: 500 }
    );
  }
}

// Crear un nuevo administrador
export async function POST(request: Request) {
  const { privilegios } = await request.json();
  try {
    const nuevoAdministrador = await prisma.administrador.create({
      data: {
        privilegios,
      },
    });
    return NextResponse.json(nuevoAdministrador, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear administrador" },
      { status: 500 }
    );
  }
}

// Actualizar un administrador
export async function PATCH(request: Request) {
  const { id, privilegios } = await request.json();
  try {
    const administradorActualizado = await prisma.administrador.update({
      where: { id },
      data: {
        privilegios,
      },
    });
    return NextResponse.json(administradorActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar administrador" },
      { status: 500 }
    );
  }
}

// Eliminar un administrador
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.administrador.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "Administrador eliminado correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar administrador" },
      { status: 500 }
    );
  }
}
