// app/api/cuentas/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Obtener todas las cuentas
export async function GET() {
  try {
    const cuentas = await prisma.cuenta.findMany();
    return NextResponse.json(cuentas);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener cuentas" },
      { status: 500 }
    );
  }
}

// Crear una nueva cuenta
export async function POST(request: Request) {
  const { saldo, tipo, usuarioId } = await request.json();
  try {
    const nuevaCuenta = await prisma.cuenta.create({
      data: {
        saldo,
        tipo,
        usuarioId,
      },
    });
    return NextResponse.json(nuevaCuenta, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear cuenta" },
      { status: 500 }
    );
  }
}

// Actualizar una cuenta existente
export async function PATCH(request: Request) {
  const { id, saldo, tipo, usuarioId } = await request.json();
  try {
    const cuentaActualizada = await prisma.cuenta.update({
      where: { id },
      data: {
        saldo,
        tipo,
        usuarioId,
      },
    });
    return NextResponse.json(cuentaActualizada);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar cuenta" },
      { status: 500 }
    );
  }
}

// Eliminar una cuenta
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.cuenta.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar cuenta" },
      { status: 500 }
    );
  }
}
