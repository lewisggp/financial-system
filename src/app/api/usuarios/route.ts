// app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Obtener todos los usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany();
    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// Crear un nuevo usuario
export async function POST(request: Request) {
  const { nombre, direccion, correo, telefono, rol, password } =
    await request.json();
  try {
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        direccion,
        correo,
        telefono,
        rol,
        password,
      },
    });
    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}

// Actualizar un usuario existente
export async function PATCH(request: Request) {
  const { id, nombre, direccion, correo, telefono, rol, password } =
    await request.json();
  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nombre,
        direccion,
        correo,
        telefono,
        rol,
        password,
      },
    });
    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// Eliminar un usuario
export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    await prisma.usuario.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
