"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemText,
  Divider,
  Box,
  ListItemButton,
  Collapse,
} from "@mui/material";
import { useRouter } from "next/navigation";

const MenuLayout = () => {
  const [open, setOpen] = useState(true); // Mantener el menú abierto
  const [isClient, setIsClient] = useState(false); // Bandera para verificar si estamos en el cliente
  const [openOthers, setOpenOthers] = useState(false); // Para manejar el estado de apertura/cierre del menú "Otros"
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Aseguramos que solo se ejecute en el cliente
  }, []);

  const handleNavigation = (path: string) => {
    if (isClient) {
      router.push(path); // Navegar a la ruta
      // setOpen(false); // Cerrar el menú si lo deseas
    }
  };

  const toggleOthers = () => {
    setOpenOthers(!openOthers); // Alternar el estado de apertura/cierre de "Otros"
  };

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <List sx={{ marginTop: 10 }}>
        {/* Menú de navegación */}
        <ListItemButton onClick={() => handleNavigation("/pagos-servicio")}>
          <ListItemText primary="Pago de Servicios" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => handleNavigation("/enviar-dinero")}>
          <ListItemText primary="Enviar Dinero" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => handleNavigation("/retirar-dinero")}>
          <ListItemText primary="Retirar Dinero" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => handleNavigation("/gestion-ingresos")}>
          <ListItemText primary="Gestión de Ingresos" />
        </ListItemButton>
        <Divider />

        {/* Menú desplegable */}
        <ListItemButton onClick={toggleOthers}>
          <ListItemText primary="Otros" />
        </ListItemButton>
        <Divider />
        <Collapse in={openOthers} timeout="auto" unmountOnExit>
          <List>
            <ListItemButton
              sx={{ paddingLeft: 4 }}
              onClick={() => handleNavigation("/cuentas")}
            >
              <ListItemText primary="Cuentas" />
            </ListItemButton>
            <Divider />
            <ListItemButton
              sx={{ paddingLeft: 4 }}
              onClick={() => handleNavigation("/pagoservicios")}
            >
              <ListItemText primary="Pagos Servicios" />
            </ListItemButton>
            <Divider />
            <ListItemButton
              sx={{ paddingLeft: 4 }}
              onClick={() => handleNavigation("/servicios")}
            >
              <ListItemText primary="Servicios" />
            </ListItemButton>
            <Divider />
            <ListItemButton
              sx={{ paddingLeft: 4 }}
              onClick={() => handleNavigation("/transacciones")}
            >
              <ListItemText primary="Transacciones" />
            </ListItemButton>
            <Divider />
            <ListItemButton
              sx={{ paddingLeft: 4 }}
              onClick={() => handleNavigation("/transferencias")}
            >
              <ListItemText primary="Transferencias" />
            </ListItemButton>
            <Divider />
            <ListItemButton
              sx={{ paddingLeft: 4 }}
              onClick={() => handleNavigation("/usuarios")}
            >
              <ListItemText primary="Usuarios" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default MenuLayout;
