// app/api/servicios/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Obtener todos los servicios
export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany();
    return NextResponse.json(servicios);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 }
    );
  }
}

// Crear un nuevo servicio
export async function POST(request: Request) {
  const { tipo, descripcion } = await request.json();
  try {
    const nuevoServicio = await prisma.servicio.create({
      data: {
        tipo,
        descripcion,
      },
    });
    return NextResponse.json(nuevoServicio, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 }
    );
  }
}

// Actualizar un servicio
export async function PATCH(request: Request) {
  const { id, tipo, descripcion } = await request.json();
  try {
    const servicioActualizado = await prisma.servicio.update({
      where: { id },
      data: {
        tipo,
        descripcion,
      },
    });
    return NextResponse.json(servicioActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar servicio" },
      { status: 500 }
    );
  }
}

// Eliminar un servicio
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.servicio.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar servicio" },
      { status: 500 }
    );
  }
}
