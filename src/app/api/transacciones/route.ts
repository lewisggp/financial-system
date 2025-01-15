// app/api/transacciones/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Obtener todas las transacciones
export async function GET() {
  try {
    const transacciones = await prisma.transaccion.findMany();
    return NextResponse.json(transacciones);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener transacciones" },
      { status: 500 }
    );
  }
}

// Crear una nueva transacción
export async function POST(request: Request) {
  const { monto, fecha, cuentaId, servicioId, usuarioId } =
    await request.json();
  try {
    const nuevaTransaccion = await prisma.transaccion.create({
      data: {
        monto,
        fecha,
        cuentaId,
        servicioId,
        usuarioId,
      },
    });
    return NextResponse.json(nuevaTransaccion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear transacción" },
      { status: 500 }
    );
  }
}

// Actualizar una transacción existente
export async function PATCH(request: Request) {
  const { id, monto, fecha, cuentaId, servicioId, usuarioId } =
    await request.json();
  try {
    const transaccionActualizada = await prisma.transaccion.update({
      where: { id },
      data: {
        monto,
        fecha,
        cuentaId,
        servicioId,
        usuarioId,
      },
    });
    return NextResponse.json(transaccionActualizada);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar transacción" },
      { status: 500 }
    );
  }
}

// Eliminar una transacción
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.transaccion.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "Transacción eliminada correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar transacción" },
      { status: 500 }
    );
  }
}
