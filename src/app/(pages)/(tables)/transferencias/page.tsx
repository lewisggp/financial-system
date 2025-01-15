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
import { Cuenta, Transaccion } from "@/types/prisma";

type TransferenciaColumn = {
  id: number;
  destinatario: string;
  cuentaOrigenId: number;
  cuentaOrigen: { id: number; saldo: number; tipo: TipoCuenta }; // Relación con la cuenta origen
  transaccionId: number;
  transaccion: { id: number; fecha: Date };
};

const columnHelper = createColumnHelper<TransferenciaColumn>();

const TransferenciasPage = () => {
  const [transferencias, setTransferencias] = useState<TransferenciaColumn[]>(
    []
  );
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]); // Lista de transacciones
  const [open, setOpen] = useState(false);
  const [selectedTransferencia, setSelectedTransferencia] =
    useState<TransferenciaColumn | null>(null);
  const [destinatario, setDestinatario] = useState<string>("");
  const [cuentaOrigenId, setCuentaOrigenId] = useState<number>(0);
  const [transaccionId, setTransaccionId] = useState<number>(0);

  // Función para cargar las transferencias desde la API
  const loadTransferencias = async () => {
    try {
      const response = await axios.get("/api/transferencias");
      setTransferencias(response.data);
    } catch (error) {
      console.error("Error al cargar las transferencias:", error);
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

  // Función para cargar las transacciones desde la API
  const loadTransacciones = async () => {
    try {
      const response = await axios.get("/api/transacciones");
      setTransacciones(response.data);
    } catch (error) {
      console.error("Error al cargar las transacciones:", error);
    }
  };

  useEffect(() => {
    loadTransferencias();
    loadCuentas();
    loadTransacciones(); // Llamamos a la función para cargar transacciones
  }, []);

  // Función para guardar o editar una transferencia
  const handleSaveTransferencia = async () => {
    if (selectedTransferencia) {
      // Editar transferencia
      await axios.patch(`/api/transferencias`, {
        id: selectedTransferencia.id,
        destinatario,
        cuentaOrigenId,
        transaccionId,
      });
    } else {
      // Crear transferencia
      await axios.post("/api/transferencias", {
        destinatario,
        cuentaOrigenId,
        transaccionId,
      });
    }
    setOpen(false);
    loadTransferencias();
  };

  // Función para eliminar una transferencia
  const handleDeleteTransferencia = async (
    transferencia: TransferenciaColumn
  ) => {
    await axios.delete(`/api/transferencias`, {
      data: { id: transferencia.id },
    });
    loadTransferencias();
  };

  // Definimos las columnas para la tabla de transferencias
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("destinatario", { header: "Destinatario" }),
    columnHelper.accessor("cuentaOrigenId", {
      header: "Cuenta Origen",
      cell: ({ row }) => {
        const cuenta = cuentas.find(
          (cuenta) => cuenta.id === row.original.cuentaOrigenId
        );
        return cuenta ? `${cuenta.tipo} - ${cuenta.saldo}` : "No encontrada";
      },
    }),
    columnHelper.accessor("transaccionId", {
      header: "Transacción",
      cell: ({ row }) => {
        const transaccion = transacciones.find(
          (transaccion) => transaccion.id === row.original.transaccionId
        );

        if (!transaccion) return "No disponible";

        const fecha = new Date(transaccion?.fecha);
        return `${fecha.toLocaleDateString("ES-es")} - ${transaccion?.monto}`;
      },
    }),
  ];

  // Función para abrir el modal de edición
  const openEditModal = (transferencia: TransferenciaColumn) => {
    setSelectedTransferencia(transferencia);
    setDestinatario(transferencia.destinatario);
    setCuentaOrigenId(transferencia.cuentaOrigenId);
    setTransaccionId(transferencia.transaccionId);
    setOpen(true);
  };

  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setSelectedTransferencia(null);
    setDestinatario("");
    setCuentaOrigenId(0);
    setTransaccionId(0);
    setOpen(true);
  };

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" color="primary">
        Gestión de Transferencias
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={openCreateModal}
        sx={{ alignSelf: "flex-start" }}
      >
        Crear Transferencia
      </Button>

      <Paper sx={{ padding: 2, boxShadow: 3 }}>
        <Table
          columns={columns}
          data={transferencias}
          onEdit={openEditModal}
          onDelete={handleDeleteTransferencia}
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
                selectedTransferencia
                  ? "Editar Transferencia"
                  : "Crear Transferencia"
              }
              titleTypographyProps={{ variant: "h5" }}
              sx={{ textAlign: "center" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Destinatario"
                    value={destinatario}
                    onChange={(e) => setDestinatario(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Select
                      value={cuentaOrigenId}
                      onChange={(e) =>
                        setCuentaOrigenId(Number(e.target.value))
                      }
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
                      value={transaccionId}
                      onChange={(e) => setTransaccionId(Number(e.target.value))}
                      fullWidth
                      variant="outlined"
                    >
                      {transacciones.map((transaccion) => (
                        <MenuItem key={transaccion.id} value={transaccion.id}>
                          {`${new Date(
                            transaccion.fecha
                          ).toLocaleDateString()} - ${transaccion.monto}`}
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
                onClick={handleSaveTransferencia}
                fullWidth
              >
                {selectedTransferencia
                  ? "Guardar Cambios"
                  : "Crear Transferencia"}
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Stack>
  );
};

export default TransferenciasPage;
