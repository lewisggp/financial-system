export enum Rol {
  CLIENTE = "CLIENTE",
  ADMINISTRADOR = "ADMINISTRADOR",
}

export enum TipoCuenta {
  AHORROS = "AHORROS",
  CORRIENTE = "CORRIENTE",
}

export enum TipoServicio {
  PAGO = "PAGO",
  TRANSFERENCIA = "TRANSFERENCIA",
}

export type Usuario = {
  id: number;
  nombre: string;
  direccion: string;
  correo: string;
  telefono: string;
  rol: Rol;
  password: string;
  cuentas: Cuenta[];
  transacciones: Transaccion[];
  clientes: Cliente[];
  administradores: Administrador[];
};

export type Cuenta = {
  id: number;
  saldo: number;
  tipo: TipoCuenta;
  usuarioId: number;
  usuario: Usuario;
  transacciones: Transaccion[];
  transferencias: Transferencia[];
};

export type Administrador = {
  id: number;
  privilegios: string;
  gestionUsuarios: Usuario[];
};

export type Transaccion = {
  id: number;
  fecha: Date;
  monto: number;
  cuentaId: number;
  cuenta: Cuenta;
  servicioId: number;
  servicio: Servicio;
  usuarioId: number;
  usuario: Usuario;
  pagoServicios: PagoServicio[];
  transferencias: Transferencia[];
  clientes: Cliente[];
};

export type Servicio = {
  id: number;
  tipo: TipoServicio;
  descripcion: string;
  transacciones: Transaccion[];
};

export type PagoServicio = {
  id: number;
  proveedor: string;
  monto: number;
  transaccionId: number;
  transaccion: Transaccion;
};

export type Transferencia = {
  id: number;
  destinatario: string;
  cuentaOrigenId: number;
  cuentaOrigen: Cuenta;
  transaccionId: number;
  transaccion: Transaccion;
};

export type Cliente = {
  id: number;
  usuarioId: number;
  historial: Transaccion[];
  usuario: Usuario;
};
