import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ip } from 'constants/ip';

const DetailsContrat = () => {
  const { idContrat } = useParams();
  const [contrat, setContrat] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContrat = async () => {
    try {
      const response = await axios.get(`${ip}/contrat/${idContrat}`);
      setContrat(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contrat:', error);
    }
  };

  useEffect(() => {
    fetchContrat();
  }, [idContrat]);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Détails du Contrat
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date de Début"
              value={new Date(contrat.dateDebutContrat).toLocaleDateString()}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date de Fin"
              value={contrat.dateFinContrat ? new Date(contrat.dateFinContrat).toLocaleDateString() : ''}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Montant"
              value={contrat.montantContrat || ''}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={contrat.descriptionContrat || ''}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={!!contrat.contratRenouvable} disabled />}
              label="Contrat Renouvable"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Type de Contrat"
              value={contrat.typeContrat || ''}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="État du Contrat"
              value={contrat.etatContrat || ''}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Signatures</Typography>
            {contrat?.Signature?.length > 0 ? (
              contrat.Signature.map((signature) => (
                <Box key={signature.idSignature} sx={{ mt: 2 }}>
                  <Typography>
                    Signé par la société: {contrat.Societe ? contrat.Societe.raisonSociale : 'Inconnue'}
                  </Typography>
                  <Typography>
                    Date de Signature: {new Date(signature.dateSignature).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>Aucune signature</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DetailsContrat;
