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
import Table from "@/components/tables/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { TipoCuenta } from "@prisma/client";

type CuentaColumn = {
  id: number;
  saldo: number;
  tipo: TipoCuenta;
  usuarioId: number;
  usuario: { nombre: string; correo: string };
};

const columnHelper = createColumnHelper<CuentaColumn>();

const CuentasPage = () => {
  const [cuentas, setCuentas] = useState<CuentaColumn[]>([]);
  const [usuarios, setUsuarios] = useState<
    { id: number; nombre: string; correo: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState<CuentaColumn | null>(
    null
  );
  const [saldo, setSaldo] = useState<number>(0);
  const [tipo, setTipo] = useState<TipoCuenta>(TipoCuenta.CORRIENTE);
  const [usuarioId, setUsuarioId] = useState<number>(0);

  // Función para cargar las cuentas desde la API
  const loadCuentas = async () => {
    try {
      const response = await axios.get("/api/cuentas");
      setCuentas(response.data);
    } catch (error) {
      console.error("Error al cargar las cuentas:", error);
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
    loadCuentas();
    loadUsuarios();
  }, []);

  // Función para guardar o editar una cuenta
  const handleSaveCuenta = async () => {
    if (selectedCuenta) {
      // Editar cuenta
      await axios.patch(`/api/cuentas`, {
        id: selectedCuenta.id,
        saldo,
        tipo,
        usuarioId,
      });
    } else {
      // Crear cuenta
      await axios.post("/api/cuentas", {
        saldo,
        tipo,
        usuarioId,
      });
    }
    setOpen(false);
    loadCuentas();
  };

  // Función para eliminar una cuenta
  const handleDeleteCuenta = async (cuenta: CuentaColumn) => {
    await axios.delete(`/api/cuentas`, { data: { id: cuenta.id } });
    loadCuentas();
  };

  // Definimos las columnas para la tabla de cuentas
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("saldo", { header: "Saldo" }),
    columnHelper.accessor("tipo", { header: "Tipo" }),
    columnHelper.accessor("usuarioId", {
      header: "Usuario",
      cell: ({ row }) => {
        const usuario = usuarios.find(
          (user) => user.id === row.original.usuarioId
        );
        return usuario
          ? `${usuario.nombre} (${usuario.correo})`
          : "No encontrado";
      },
    }),
  ];

  // Función para abrir el modal de edición
  const openEditModal = (cuenta: CuentaColumn) => {
    setSelectedCuenta(cuenta);
    setSaldo(cuenta.saldo);
    setTipo(cuenta.tipo);
    setUsuarioId(cuenta.usuarioId);
    setOpen(true);
  };

  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setSelectedCuenta(null);
    setSaldo(0);
    setTipo(TipoCuenta.CORRIENTE);
    setUsuarioId(0);
    setOpen(true);
  };

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" color="primary">
        Gestión de Cuentas
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={openCreateModal}
        sx={{ alignSelf: "flex-start" }}
      >
        Crear Cuenta
      </Button>

      <Paper sx={{ padding: 2, boxShadow: 3 }}>
        <Table
          columns={columns}
          data={cuentas}
          onEdit={openEditModal}
          onDelete={handleDeleteCuenta}
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
              title={selectedCuenta ? "Editar Cuenta" : "Crear Cuenta"}
              titleTypographyProps={{ variant: "h5" }}
              sx={{ textAlign: "center" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Saldo"
                    value={saldo}
                    onChange={(e) => setSaldo(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as TipoCuenta)}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value={TipoCuenta.CORRIENTE}>
                        Cuenta Corriente
                      </MenuItem>
                      <MenuItem value={TipoCuenta.AHORROS}>
                        Cuenta de Ahorro
                      </MenuItem>
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
                onClick={handleSaveCuenta}
                fullWidth
              >
                {selectedCuenta ? "Guardar Cambios" : "Crear Cuenta"}
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Stack>
  );
};

export default CuentasPage;
