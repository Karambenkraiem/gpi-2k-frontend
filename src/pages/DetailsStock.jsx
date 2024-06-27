import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, Slider } from '@mui/material';
import axios from 'axios';
import { ip } from 'constants/ip';  // Make sure to have this file and ip constant correctly set up

const StockDetails = () => {
  const { refArt } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchStock = async () => {
    try {
      const response = await axios.get(`${ip}/stocks/${refArt}`);
      console.log('API response:', response.data); // Log the response data for debugging
      setStock(response.data);
    } catch (error) {
      console.error("Erreur recupération données !!!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [refArt]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!stock) {
    return <Typography>No data found.</Typography>;
  }

  return (
    <Container>
      <Button onClick={() => navigate(-1)} variant="contained" style={{ marginBottom: 16 }}>
        Back
      </Button>
      <Paper elevation={3} style={{ padding: 16 }}>
        <Typography variant="h2" gutterBottom>
        Detail d'article
        </Typography>
        <Box mb={2}>
          <Typography variant="h3">{stock.categorie}</Typography>
          <Typography variant="h6">Marque: {stock.marque}</Typography>
          <Typography variant="h6">Modèle: {stock.modele}</Typography>
          <Typography variant="h6">Prix: {stock.prix} TND</Typography>
          <Typography variant="h6">Quantité en Stock: {stock.quantiteStock}</Typography>
          <Slider
            value={stock.quantiteStock}
            aria-labelledby="quantity-slider"
            min={0}
            max={100}
            valueLabelDisplay="auto"
            sx={{
              color: stock.quantiteStock <= 5 ? 'red' : 'primary.main',
              outline: stock.quantiteStock <= 5 ? '2px solid red' : 'none',
            }}
          />
          <Typography variant="h6">Fournisseur : {stock.societe?.raisonSociale}</Typography>
        </Box>
        {stock.categorie === 'Toner' && (
          <>
            <Typography variant="h6">Capacité Toner: {stock.capaciteToner}</Typography>
            <Typography variant="h6">Compatibilité Toner: {stock.compatibiliteToner}</Typography>
            <Typography variant="h6">Couleur Toner: {stock.couleurToner}</Typography>
          </>
        )}
        {stock.categorie === 'Disque' && (
          <>
            <Typography variant="h6">Capacité: {stock.capaciteFlashDvdCdRamHDD}</Typography>
            <Typography variant="h6">Type Disque: {stock.typeDisqueStoquage}</Typography>
            <Typography variant="h6">Interface HDD: {stock.interFaceHDD}</Typography>
            <Typography variant="h6">Vitesse HDD: {stock.vitesseHDD}</Typography>
            <Typography variant="h6">Taille HDD: {stock.tailleHDD}</Typography>
            <Typography variant="h6">Type HDD: {stock.TypeHDD}</Typography>
          </>
        )}
        {stock.categorie === 'ClavierSouris' && (
          <>
            <Typography variant="h6">Type Connexion: {stock.typeConnexionClavierSouris}</Typography>
            <Typography variant="h6">Disposition Touche: {stock.dispositionToucheClavier}</Typography>
            <Typography variant="h6">Nombre Bouton: {stock.nombreBouttonSouris}</Typography>
          </>
        )}
        {stock.categorie === 'CarteGraphique' && (
          <>
            <Typography variant="h6">Mémoire RAM: {stock.memoireCarteGraphiqueRam}</Typography>
            <Typography variant="h6">Interface: {stock.IntefaceCarteGraphique}</Typography>
            <Typography variant="h6">Fréquence RAM: {stock.frequenceCarteGraphiqueRam}</Typography>
          </>
        )}
        {stock.categorie === 'RAM' && (
          <>
            <Typography variant="h6">Type RAM: {stock.typeRam}</Typography>
          </>
        )}
        {stock.autre && (
          <Typography variant="h6">Autre: {stock.autre}</Typography>
        )}
        
      </Paper>
    </Container>
  );
};

export default StockDetails;
