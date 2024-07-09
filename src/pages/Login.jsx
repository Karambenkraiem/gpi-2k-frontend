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
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError(""); // Clear previous error messages
    axios
      .post(`${ip}/auth/login`, { idUtilisateur: +idUtilisateur, password })
      .then((res) => {
        localStorage.setItem("token", res.data);
        return getWithHeaders("/auth/my-info");
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        if (err.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          setError(`Error: ${err.response.data.message || err.response.statusText}`);
        } else if (err.request) {
          // The request was made but no response was received
          setError("Error: No response received from server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${err.message}`);
        }
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
        {error && (
          <Typography variant="body1" color="error" gutterBottom>
            {error}
          </Typography>
        )}
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
