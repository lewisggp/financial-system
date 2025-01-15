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
import { Cuenta, Transaccion } from "@/types/prisma"; // Asegúrate de tener estos tipos

type PagoServicio = {
  id: number;
  proveedor: string;
  monto: number;
  transaccionId: number;
  transaccion: Transaccion;
};

const columnHelper = createColumnHelper<PagoServicio>();

const PagosServicioPage = () => {
  const [pagos, setPagos] = useState<PagoServicio[]>([]); // Lista de pagos de servicio
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]); // Lista de transacciones
  const [open, setOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState<PagoServicio | null>(null);
  const [proveedor, setProveedor] = useState<string>("");
  const [monto, setMonto] = useState<number>(0);
  const [transaccionId, setTransaccionId] = useState<number>(0);

  // Función para cargar los pagos de servicio desde la API
  const loadPagos = async () => {
    try {
      const response = await axios.get("/api/pagoservicios");
      setPagos(response.data);
    } catch (error) {
      console.error("Error al cargar los pagos:", error);
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
    loadPagos();
    loadTransacciones(); // Llamamos a la función para cargar transacciones
  }, []);

  // Función para guardar o editar un pago
  const handleSavePago = async () => {
    if (selectedPago) {
      // Editar pago
      await axios.patch(`/api/pagoservicios`, {
        id: selectedPago.id,
        proveedor,
        monto,
        transaccionId,
      });
    } else {
      // Crear pago
      await axios.post("/api/pagoservicios", {
        proveedor,
        monto,
        transaccionId,
      });
    }
    setOpen(false);
    loadPagos();
  };

  // Función para eliminar un pago
  const handleDeletePago = async (pago: PagoServicio) => {
    await axios.delete(`/api/pagoservicios`, {
      data: { id: pago.id },
    });
    loadPagos();
  };

  // Definimos las columnas para la tabla de pagos de servicio
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("proveedor", { header: "Proveedor" }),
    columnHelper.accessor("monto", { header: "Monto" }),
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
  const openEditModal = (pago: PagoServicio) => {
    setSelectedPago(pago);
    setProveedor(pago.proveedor);
    setMonto(pago.monto);
    setTransaccionId(pago.transaccionId);
    setOpen(true);
  };

  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setSelectedPago(null);
    setProveedor("");
    setMonto(0);
    setTransaccionId(0);
    setOpen(true);
  };

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" color="primary">
        Gestión de Pagos de Servicio
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={openCreateModal}
        sx={{ alignSelf: "flex-start" }}
      >
        Crear Pago de Servicio
      </Button>

      <Paper sx={{ padding: 2, boxShadow: 3 }}>
        <Table
          columns={columns}
          data={pagos}
          onEdit={openEditModal}
          onDelete={handleDeletePago}
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
                selectedPago
                  ? "Editar Pago de Servicio"
                  : "Crear Pago de Servicio"
              }
              titleTypographyProps={{ variant: "h5" }}
              sx={{ textAlign: "center" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Proveedor"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
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
                onClick={handleSavePago}
                fullWidth
              >
                {selectedPago ? "Guardar Cambios" : "Crear Pago de Servicio"}
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Stack>
  );
};

export default PagosServicioPage;
