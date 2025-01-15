import React from "react";
import { Box, AppBar, Toolbar, Typography, Stack } from "@mui/material";
import MenuLayout from "@/components/layouts/MenuLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Barra superior */}
      <AppBar sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6">Gestión Financiera</Typography>
        </Toolbar>
      </AppBar>

      {/* Menú lateral */}
      <MenuLayout />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          ml: { xs: 0, md: 2 }, // Asegura que el contenido no quede pegado al menú en pantallas grandes
          pt: 8, // Ajuste del padding superior para que no se superponga con el AppBar
          overflow: "auto", // Asegura que el contenido no se salga de la pantalla si es demasiado largo
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
