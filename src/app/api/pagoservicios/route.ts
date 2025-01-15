// app/api/pagoservicio/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Obtener todos los pagos de servicio
export async function GET() {
  try {
    const pagosServicios = await prisma.pagoServicio.findMany();
    return NextResponse.json(pagosServicios);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener pagos de servicio" },
      { status: 500 }
    );
  }
}

// Crear un nuevo pago de servicio
export async function POST(request: Request) {
  const { proveedor, monto, transaccionId } = await request.json();
  try {
    const nuevoPagoServicio = await prisma.pagoServicio.create({
      data: {
        proveedor,
        monto,
        transaccionId,
      },
    });
    return NextResponse.json(nuevoPagoServicio, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear pago de servicio" },
      { status: 500 }
    );
  }
}

// Actualizar un pago de servicio existente
export async function PATCH(request: Request) {
  const { id, proveedor, monto, transaccionId } = await request.json();
  try {
    const pagoServicioActualizado = await prisma.pagoServicio.update({
      where: { id },
      data: {
        proveedor,
        monto,
        transaccionId,
      },
    });
    return NextResponse.json(pagoServicioActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar pago de servicio" },
      { status: 500 }
    );
  }
}

// Eliminar un pago de servicio
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.pagoServicio.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "Pago de servicio eliminado correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar pago de servicio" },
      { status: 500 }
    );
  }
}
