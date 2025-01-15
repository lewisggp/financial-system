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
import Table from "@/components/tables/Table"; // Asumimos que tienes una tabla reusable
import { createColumnHelper } from "@tanstack/react-table";
import { TipoServicio } from "@prisma/client"; // Tipo de servicio

type ServicioColumn = {
  id: number;
  tipo: TipoServicio;
  descripcion: string;
};

const columnHelper = createColumnHelper<ServicioColumn>();

const ServiciosPage = () => {
  const [servicios, setServicios] = useState<ServicioColumn[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] =
    useState<ServicioColumn | null>(null);
  const [tipo, setTipo] = useState<TipoServicio>(TipoServicio.PAGO); // Tipo de servicio
  const [descripcion, setDescripcion] = useState<string>("");

  // Función para cargar los servicios desde la API
  const loadServicios = async () => {
    try {
      const response = await axios.get("/api/servicios");
      setServicios(response.data);
    } catch (error) {
      console.error("Error al cargar los servicios:", error);
    }
  };

  useEffect(() => {
    loadServicios();
  }, []);

  // Función para guardar o editar un servicio
  const handleSaveServicio = async () => {
    if (selectedServicio) {
      // Editar servicio
      await axios.patch(`/api/servicios`, {
        id: selectedServicio.id,
        tipo,
        descripcion,
      });
    } else {
      // Crear servicio
      await axios.post("/api/servicios", {
        tipo,
        descripcion,
      });
    }
    setOpen(false);
    loadServicios();
  };

  // Función para eliminar un servicio
  const handleDeleteServicio = async (servicio: ServicioColumn) => {
    await axios.delete(`/api/servicios`, { data: { id: servicio.id } });
    loadServicios();
  };

  // Definimos las columnas para la tabla de servicios
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("tipo", { header: "Tipo" }),
    columnHelper.accessor("descripcion", { header: "Descripción" }),
  ];

  // Función para abrir el modal de edición
  const openEditModal = (servicio: ServicioColumn) => {
    setSelectedServicio(servicio);
    setTipo(servicio.tipo);
    setDescripcion(servicio.descripcion);
    setOpen(true);
  };

  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setSelectedServicio(null);
    setTipo(TipoServicio.PAGO);
    setDescripcion("");
    setOpen(true);
  };

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" color="primary">
        Gestión de Servicios
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={openCreateModal}
        sx={{ alignSelf: "flex-start" }}
      >
        Crear Servicio
      </Button>

      <Paper sx={{ padding: 2, boxShadow: 3 }}>
        <Table
          columns={columns}
          data={servicios}
          onEdit={openEditModal}
          onDelete={handleDeleteServicio}
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
              title={selectedServicio ? "Editar Servicio" : "Crear Servicio"}
              titleTypographyProps={{ variant: "h5" }}
              sx={{ textAlign: "center" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as TipoServicio)}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value={TipoServicio.PAGO}>Pago</MenuItem>
                      <MenuItem value={TipoServicio.TRANSFERENCIA}>
                        Transferencia
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveServicio}
                fullWidth
              >
                {selectedServicio ? "Guardar Cambios" : "Crear Servicio"}
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Stack>
  );
};

export default ServiciosPage;
