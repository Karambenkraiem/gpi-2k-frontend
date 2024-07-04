import React, { useContext, useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";
import { getWithHeaders } from "helpers/axiosWithHeaders";
import { UserContext } from "router/Router";

const Login = () => {
  const [idUtilisateur, setIdUtilisateur] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const handleLogin = () => {
    // Handle login logic here
    axios
      .post(ip + "/auth/login", { idUtilisateur: +idUtilisateur, password })
      .then((res) => {
        localStorage.setItem("token", res.data);
        getWithHeaders("/auth/my-info").then((response) =>
          setUser(response.data)
        );
      });
  };
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          label="ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={idUtilisateur}
          onChange={(e) => setIdUtilisateur(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
