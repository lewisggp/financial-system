"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import Table from "@/components/tables/Table"; // Suponemos que tienes una tabla reutilizable
import { createColumnHelper } from "@tanstack/react-table";
import { Cuenta, Servicio, Usuario } from "@/types/prisma"; // Asegúrate de que estas interfaces estén bien definidas

type TransaccionColumn = {
  id: number;
  fecha: Date;
  monto: number;
  cuentaId: number;
  cuenta: Cuenta; // Relación con la cuenta
  servicioId: number;
  servicio: Servicio; // Relación con el servicio
  usuarioId: number;
  usuario: Usuario; // Relación con el usuario
};

const columnHelper = createColumnHelper<TransaccionColumn>();

const TransaccionesFiltradasPage = () => {
  const [transacciones, setTransacciones] = useState<TransaccionColumn[]>([]);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number>(0);

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

  // Filtrar las transacciones por usuario seleccionado
  const filteredTransacciones = selectedUsuarioId
    ? transacciones.filter(
        (transaccion) => transaccion.usuarioId === selectedUsuarioId
      )
    : transacciones;

  useEffect(() => {
    loadTransacciones();
    loadCuentas();
    loadServicios();
    loadUsuarios();
  }, []);

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

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" color="primary">
        Gestion de Ingresos
      </Typography>

      {/* Filtro de usuario */}
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <Select
          value={selectedUsuarioId}
          onChange={(e) => setSelectedUsuarioId(Number(e.target.value))}
          fullWidth
          variant="outlined"
        >
          <MenuItem value={0}>Todos los usuarios</MenuItem>
          {usuarios.map((usuario) => (
            <MenuItem key={usuario.id} value={usuario.id}>
              {usuario.nombre} ({usuario.correo})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper sx={{ padding: 2, boxShadow: 3 }}>
        <Table columns={columns} data={filteredTransacciones} />
      </Paper>
    </Stack>
  );
};

export default TransaccionesFiltradasPage;
