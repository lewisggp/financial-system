"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
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
import { Rol } from "@prisma/client";
import Table from "@/components/tables/Table";
import { createColumnHelper } from "@tanstack/react-table";

// Definimos los tipos de columnas de la tabla
type UsuarioColumn = {
  id: number;
  nombre: string;
  correo: string;
  direccion: string;
  telefono: string;
  rol: Rol;
  password: string;
};

const columnHelper = createColumnHelper<UsuarioColumn>();

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<UsuarioColumn[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioColumn | null>(
    null
  );
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>(Rol.CLIENTE);

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
    loadUsuarios();
  }, []);

  // Función para guardar o editar un usuario
  const handleSaveUsuario = async () => {
    if (selectedUsuario) {
      // Editar usuario
      await axios.patch(`/api/usuarios`, {
        id: selectedUsuario.id,
        nombre,
        correo,
        direccion,
        telefono,
        password,
        rol,
      });
    } else {
      // Crear usuario
      await axios.post("/api/usuarios", {
        nombre,
        correo,
        direccion,
        telefono,
        password,
        rol,
      });
    }
    setOpen(false);
    loadUsuarios();
  };

  // Función para eliminar un usuario
  const handleDeleteUsuario = async (usuario: UsuarioColumn) => {
    await axios.delete(`/api/usuarios`, { data: { id: usuario.id } });
    loadUsuarios();
  };

  // Definimos las columnas para la tabla
  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.accessor("correo", { header: "Correo" }),
    columnHelper.accessor("direccion", { header: "Dirección" }),
    columnHelper.accessor("telefono", { header: "Teléfono" }),
    columnHelper.accessor("rol", { header: "Rol" }),
  ];

  // Función para abrir el modal de edición
  const openEditModal = (usuario: UsuarioColumn) => {
    setSelectedUsuario(usuario);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setDireccion(usuario.direccion);
    setTelefono(usuario.telefono);
    setPassword(usuario.password);
    setRol(usuario.rol);
    setOpen(true);
  };

  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setSelectedUsuario(null);
    setNombre("");
    setCorreo("");
    setDireccion("");
    setTelefono("");
    setPassword("");
    setRol(Rol.CLIENTE);
    setOpen(true);
  };

  return (
    <Stack spacing={4} sx={{ padding: 2 }}>
      <Typography variant="h3" align="center" color="primary">
        Gestión de Usuarios
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={openCreateModal}
        sx={{ alignSelf: "flex-start" }}
      >
        Crear Usuario
      </Button>

      <Paper sx={{ padding: 2, boxShadow: 3 }}>
        <Table
          columns={columns}
          data={usuarios}
          onEdit={openEditModal}
          onDelete={handleDeleteUsuario}
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
              title={selectedUsuario ? "Editar Usuario" : "Crear Usuario"}
              titleTypographyProps={{ variant: "h5" }}
              sx={{ textAlign: "center" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    fullWidth
                    variant="outlined"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    fullWidth
                    variant="outlined"
                    type="tel"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    variant="outlined"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Select
                      value={rol}
                      onChange={(e) => setRol(e.target.value as Rol)}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value={Rol.CLIENTE}>Cliente</MenuItem>
                      <MenuItem value={Rol.ADMINISTRADOR}>
                        Administrador
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveUsuario}
                fullWidth
              >
                {selectedUsuario ? "Guardar Cambios" : "Crear Usuario"}
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Stack>
  );
};

export default UsuariosPage;
