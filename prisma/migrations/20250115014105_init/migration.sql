-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "saldo" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Cuenta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Administrador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "privilegios" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Transaccion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" REAL NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Transaccion_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuenta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaccion_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PagoServicio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proveedor" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "transaccionId" INTEGER NOT NULL,
    CONSTRAINT "PagoServicio_transaccionId_fkey" FOREIGN KEY ("transaccionId") REFERENCES "Transaccion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transferencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destinatario" TEXT NOT NULL,
    "cuentaOrigenId" INTEGER NOT NULL,
    "transaccionId" INTEGER NOT NULL,
    CONSTRAINT "Transferencia_cuentaOrigenId_fkey" FOREIGN KEY ("cuentaOrigenId") REFERENCES "Cuenta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transferencia_transaccionId_fkey" FOREIGN KEY ("transaccionId") REFERENCES "Transaccion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Cliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GestionUsuarios" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GestionUsuarios_A_fkey" FOREIGN KEY ("A") REFERENCES "Administrador" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GestionUsuarios_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Historial" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Historial_A_fkey" FOREIGN KEY ("A") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Historial_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaccion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "_GestionUsuarios_AB_unique" ON "_GestionUsuarios"("A", "B");

-- CreateIndex
CREATE INDEX "_GestionUsuarios_B_index" ON "_GestionUsuarios"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Historial_AB_unique" ON "_Historial"("A", "B");

-- CreateIndex
CREATE INDEX "_Historial_B_index" ON "_Historial"("B");
