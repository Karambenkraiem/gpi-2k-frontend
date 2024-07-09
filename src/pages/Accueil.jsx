import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Accueil = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TECI
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Se Déconnecter
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Bienvenue sur la page d'accueil
        </Typography>
        <Typography variant="h6">
          {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
        </Typography>
        <Typography variant="body1" style={{ marginTop: '40px' }}>
          Développé par 2K Info
        </Typography>
        <Typography variant="body2">
          2023 / 2024
        </Typography>
      </Container>
    </Container>
  );
};

export default Accueil;
