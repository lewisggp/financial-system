// app/api/transferencia/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Obtener todas las transferencias
export async function GET() {
  try {
    const transferencias = await prisma.transferencia.findMany();
    return NextResponse.json(transferencias);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener transferencias" },
      { status: 500 }
    );
  }
}

// Crear una nueva transferencia
export async function POST(request: Request) {
  const { destinatario, cuentaOrigenId, transaccionId } = await request.json();
  try {
    const nuevaTransferencia = await prisma.transferencia.create({
      data: {
        destinatario,
        cuentaOrigenId,
        transaccionId,
      },
    });
    return NextResponse.json(nuevaTransferencia, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear transferencia" },
      { status: 500 }
    );
  }
}

// Actualizar una transferencia existente
export async function PATCH(request: Request) {
  const { id, monto, destinatario, cuentaOrigenId, transaccionId } =
    await request.json();
  try {
    const transferenciaActualizada = await prisma.transferencia.update({
      where: { id },
      data: {
        destinatario,
        cuentaOrigenId,
        transaccionId,
      },
    });
    return NextResponse.json(transferenciaActualizada);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar transferencia" },
      { status: 500 }
    );
  }
}

// Eliminar una transferencia
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.transferencia.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "Transferencia eliminada correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar transferencia" },
      { status: 500 }
    );
  }
}
