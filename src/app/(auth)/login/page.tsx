// pages/login.tsx

import LoginComponent from "@/components/forms/login";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const LoginPage = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <LoginComponent />
      </Paper>
    </Container>
  );
};

export default LoginPage;
