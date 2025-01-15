"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  Typography,
  Stack,
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
} from "@mui/material";
import Table from "@/components/tables/Table"; // Suponemos que tienes una tabla reutilizable
import { createColumnHelper } from "@tanstack/react-table";
import { TipoCuenta } from "@prisma/client"; // Asegúrate de tener este tipo
import { Cuenta, Servicio, Usuario } from "@/types/prisma";

type TransaccionColumn = {
  id: number;
  fecha: Date;
  monto: number;
  cuentaId: number;
  cuenta: { id: number; saldo: number; tipo: TipoCuenta }; // Relación con la cuenta
  servicioId: number;
  servicio: { tipo: string; descripcion: string }; // Relación con el servicio
  usuarioId: number;
  usuario: { nombre: string; correo: string }; // Relación con el usuario
};

const columnHelper = createColumnHelper<TransaccionColumn>();

const TransaccionesPage = () => {
  const [transacciones, setTransacciones] = useState<TransaccionColumn[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTransaccion, setSelectedTransaccion] =
    useState<TransaccionColumn | null>(null);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [monto, setMonto] = useState<number>(0);
  const [cuentaId, setCuentaId] = useState<number>(0);
  const [servicioId, setServicioId] = useState<number>(0);
  const [usuarioId, setUsuarioId] = useState<number>(0);

  // Función para cargar las transacciones desde la API
  const loadTransacciones = async () => {
    try {
      const response = await axios.get("/api/transacciones");
      setTransacciones(response.data);
    } catch (error) {
      console.error("Error al cargar las transacciones:", error);
    }
  };

  // Función para cargar las cuentas desde la API
  const loadCuentas = async () => {
    try {
      const response = await axios.get("/api/cuentas");
      setCuentas(response.data);
    } catch (error) {
      console.error("Error al cargar las cuentas:", error);
    }
  };

  // Función para cargar los servicios desde la API
  const loadServicios = async () => {
    try {
      const response = await axios.get("/api/servicios");
      setServicios(response.data);
    } catch (error) {
      console.error("Error al cargar los servicios:", error);
    }
  };

  // Función para cargar los usuarios desde la API
  const loadUsuarios = async () => {
    try {
      const response = await axios.get("/api/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
    }
  };

  useEffect(() => {
    loadTransacciones();
    loadCuentas();
    loadServicios();
    loadUsuarios();
  }, []);

  // Función para guardar o editar una transacción
  const handleSaveTransaccion = async () => {
    const formattedFecha = fecha ? fecha.toISOString() : null;

    if (selectedTransaccion) {
      // Editar transacción
      await axios.patch(`/api/transacciones`, {
        id: selectedTransaccion.id,
        fecha: formattedFecha,
        monto,
        cuentaId,
        servicioId,
        usuarioId,
      });
    } else {
      // Crear transacción
      await axios.post("/api/transacciones", {
        fecha: formattedFecha,
        monto,
        cuentaId,
        servicioId,
        usuarioId,
      });
    }
    setOpen(false);
    loadTransacciones();
  };

  // Función para eliminar una transacción
  const handleDeleteTransaccion = async (transaccion: TransaccionColumn) => {
    await axios.delete(`/api/transacciones`, { data: { id: transaccion.id } });
    loadTransacciones();
  };

  // Definimos las columnas para la tabla de transacciones
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("fecha", {
      header: "Fecha",
      cell: ({ row }) => {
        const fecha = new Date(row.original.fecha);
        return fecha.toLocaleDateString("es-ES");
      },
    }),
    columnHelper.accessor("monto", { header: "Monto" }),
    columnHelper.accessor("cuentaId", {
      header: "Cuenta",
      cell: ({ row }) => {
        const cuenta = cuentas.find(
          (cuenta) => cuenta.id === row.original.cuentaId
        );
        return cuenta ? `${cuenta.tipo} - ${cuenta.saldo}` : "No encontrada";
      },
    }),
    columnHelper.accessor("servicioId", {
      header: "Servicio",
      cell: ({ row }) => {
        const servicio = servicios.find(
          (servicio) => servicio.id === row.original.servicioId
        );
        return servicio ? servicio.descripcion : "No encontrado";
      },
    }),
    columnHelper.accessor("usuarioId", {
      header: "Usuario",
      cell: ({ row }) => {
        const usuario = usuarios.find(
          (usuario) => usuario.id === row.original.usuarioId
        );
        return usuario
          ? `${usuario.nombre} (${usuario.correo})`
          : "No encontrado";
      },
    }),
  ];

  // Función para abrir el modal de edición
  const openEditModal = (transaccion: TransaccionColumn) => {
    setSelectedTransaccion(transaccion);
    setFecha(new Date(transaccion.fecha));
    setMonto(transaccion.monto);
    setCuentaId(transaccion.cuentaId);
    setServicioId(transaccion.servicioId);
    setUsuarioId(transaccion.usuarioId);
    setOpen(true);
  };

  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setSelectedTransaccion(null);
    setFecha(null);
    setMonto(0);
    setCuentaId(0);
    setServicioId(0);
    setUsuarioId(0);
    setOpen(true);
  };

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" color="primary">
        Gestión de Transacciones
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={openCreateModal}
        sx={{ alignSelf: "flex-start" }}
      >
        Crear Transacción
      </Button>

      <Paper sx={{ padding: 2, boxShadow: 3 }}>
        <Table
          columns={columns}
          data={transacciones}
          onEdit={openEditModal}
          onDelete={handleDeleteTransaccion}
        />
      </Paper>

      {/* Card de Creación y Edición */}
      {open && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Card sx={{ maxWidth: 500, padding: 3 }}>
            <CardHeader
              title={
                selectedTransaccion ? "Editar Transacción" : "Crear Transacción"
              }
              titleTypographyProps={{ variant: "h5" }}
              sx={{ textAlign: "center" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Fecha"
                    type="date"
                    value={fecha?.toISOString().split("T")[0]}
                    onChange={(e) => setFecha(new Date(e.target.value))}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Monto"
                    value={monto}
                    onChange={(e) => setMonto(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Select
                      value={cuentaId}
                      onChange={(e) => setCuentaId(Number(e.target.value))}
                      fullWidth
                      variant="outlined"
                    >
                      {cuentas.map((cuenta) => (
                        <MenuItem key={cuenta.id} value={cuenta.id}>
                          {cuenta.tipo} - {cuenta.saldo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Select
                      value={servicioId}
                      onChange={(e) => setServicioId(Number(e.target.value))}
                      fullWidth
                      variant="outlined"
                    >
                      {servicios.map((servicio) => (
                        <MenuItem key={servicio.id} value={servicio.id}>
                          {servicio.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Select
                      value={usuarioId}
                      onChange={(e) => setUsuarioId(Number(e.target.value))}
                      fullWidth
                      variant="outlined"
                    >
                      {usuarios.map((usuario) => (
                        <MenuItem key={usuario.id} value={usuario.id}>
                          {usuario.nombre} ({usuario.correo})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveTransaccion}
                fullWidth
              >
                {selectedTransaccion ? "Guardar Cambios" : "Crear Transacción"}
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Stack>
  );
};

export default TransaccionesPage;
