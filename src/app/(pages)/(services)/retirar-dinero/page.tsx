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
  Grid,
  TextField,
  FormControl,
} from "@mui/material";
import { Cuenta, Servicio, Usuario } from "@/types/prisma";

const CrearTransaccionPage = () => {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [fecha, setFecha] = useState<Date | null>(null);
  const [monto, setMonto] = useState<number>(0);
  const [cuentaId, setCuentaId] = useState<number>(0);
  const [servicioId, setServicioId] = useState<number>(0);
  const [usuarioId, setUsuarioId] = useState<number>(0);

  // Función para cargar los datos necesarios
  useEffect(() => {
    axios.get("/api/cuentas").then((response) => setCuentas(response.data));
    axios.get("/api/servicios").then((response) => setServicios(response.data));
    axios.get("/api/usuarios").then((response) => setUsuarios(response.data));
  }, []);

  // Función para crear una transacción
  const handleCreateTransaccion = async () => {
    const formattedFecha = fecha ? fecha.toISOString() : null;

    if (
      !fecha ||
      monto <= 0 ||
      cuentaId <= 0 ||
      servicioId <= 0 ||
      usuarioId <= 0
    ) {
      alert("Por favor complete todos los campos.");
      return;
    }

    try {
      await axios.post("/api/transacciones", {
        fecha: formattedFecha,
        monto,
        cuentaId,
        servicioId,
        usuarioId,
      });
      alert("Transacción creada exitosamente.");
    } catch (error) {
      console.error("Error al crear la transacción:", error);
      alert("Hubo un error al crear la transacción.");
    }
  };

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" color="primary">
        Retirar Dinero
      </Typography>

      <Card sx={{ padding: 3 }}>
        <CardHeader
          title="Retirar dinero en efectivo"
          titleTypographyProps={{ variant: "h5" }}
          sx={{ textAlign: "center" }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Fecha"
                type="date"
                value={fecha?.toISOString().split("T")[0] || ""}
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
            onClick={handleCreateTransaccion}
            fullWidth
          >
            Retirar
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
};

export default CrearTransaccionPage;
