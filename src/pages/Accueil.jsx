import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import logoTECI1 from '../assets/logoTECI.jpg'; // Assurez-vous que le chemin est correct
import logoTECI2 from '../assets/ISETRADESLOGO.jpg'; // Assurez-vous que le chemin est correct

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
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <img src={logoTECI1} alt="Logo TECI 1" style={{ maxWidth: '100px', marginRight: '20px' }} />
          <img src={logoTECI2} alt="Logo TECI 2" style={{ maxWidth: '100px' }} />
        </Box>
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
