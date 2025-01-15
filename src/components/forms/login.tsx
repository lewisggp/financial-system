"use client";

import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginComponent = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Realizamos la llamada a la API para obtener los usuarios
      const response = await axios.get("/api/usuarios");
      const usuarios = response.data;

      // Buscamos si el usuario existe en la base de datos
      const usuario = usuarios.find(
        (user: { correo: string }) => user.correo === correo
      );

      if (!usuario) {
        setError("Correo o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // Comparamos la contraseña
      if (usuario.password === password) {
        router.push("/inicio");
      } else {
        setError("Correo o contraseña incorrectos");
      }
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 3 }}
      >
        Iniciar sesión
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Correo Electrónico"
              variant="outlined"
              fullWidth
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              required
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography
                color="error"
                sx={{ textAlign: "center", fontSize: 14 }}
              >
                {error}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                padding: "12px 0",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: 16,
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default LoginComponent;
