import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import logoTECI1 from '../assets/TECILOGO.png'; // Assurez-vous que le chemin est correct
import logoTECI2 from '../assets/ISETRADESLOGO.png'; // Assurez-vous que le chemin est correct
import logo2K from '../assets/2K.png'; // Assurez-vous que le chemin est correct

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
            TECI  -  ISET
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
      <Container style={{ textAlign: 'center', marginTop: '1px' }}>
        <Box display="d-flex" justifyContent="center" alignItems="center" mb={2}>
          <img src={logoTECI1} alt="Logo TECI 1" style={{ maxWidth: '150', marginRight: '20px' }} />
          <img src={logoTECI2} alt="Logo TECI 2" style={{ maxWidth: '150' }} />
        </Box>
        <Typography variant="h4" gutterBottom>
        Gestion Simplifiée, Performance Maximisée       
         </Typography>
        <Typography variant="h6">
          {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <img src={logo2K} alt="Logo 2K" style={{ maxWidth: '140px', marginRight: '20px' }} />
        </Box>
        <Typography variant="body1" style={{ marginTop: '5px' }}>
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
