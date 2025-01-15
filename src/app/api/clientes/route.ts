// app/api/cliente/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany();
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

// Crear un nuevo cliente
export async function POST(request: Request) {
  const { usuarioId, historial } = await request.json();
  try {
    const nuevoCliente = await prisma.cliente.create({
      data: {
        usuarioId,
        historial,
      },
    });
    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear cliente" },
      { status: 500 }
    );
  }
}

// Actualizar un cliente
export async function PATCH(request: Request) {
  const { id, usuarioId, historial } = await request.json();
  try {
    const clienteActualizado = await prisma.cliente.update({
      where: { id },
      data: {
        usuarioId,
        historial,
      },
    });
    return NextResponse.json(clienteActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}

// Eliminar un cliente
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.cliente.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}
