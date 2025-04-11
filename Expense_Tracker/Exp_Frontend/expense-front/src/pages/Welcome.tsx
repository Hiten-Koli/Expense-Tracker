// src/pages/Welcome.tsx
import { Box, Button, Container, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import { useEffect } from "react";

const Welcome = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/expenses");
    }
  }, [token, navigate]);

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Welcome to Your Expense Tracker 
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 4 }}>
          Manage your income, expenses, and budget all in one place. Stay in control of your finances.
        </Typography>
        <Box display="flex" justifyContent="center" gap={3}>
          <Button variant="contained" size="large" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate("/register")}>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Welcome;
