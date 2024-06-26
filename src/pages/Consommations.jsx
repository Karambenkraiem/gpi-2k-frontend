import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import { ip } from 'constants/ip';

const Consommations = () => {
  const [consommations, setConsommations] = useState([]);

  useEffect(() => {
    axios.get(ip+'/consommation')
      .then(response => {
        setConsommations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the alimentations!', error);
      });
  }, []);

  const columns = [
    { field: 'idConsommation', headerName: 'ID', width: 90 },
    { field: 'refArt', headerName: 'Reference Article', width: 150 },
    { field: 'idUtilisateur', headerName: 'ID Utilisateur', width: 150 },
    { field: 'numeroSerie', headerName: 'Numero Série Materiel', width: 150 },
    { field: 'dateConsommation', headerName: 'Date Consommation', width: 200 },
    { field: 'quantiteConsomme', headerName: 'Quantite Consomme', width: 150 },
  ];
  const navigate = useNavigate();

  return (
    <div style={{ height: 400, width: '100%' }}>
       <Button
        onClick={() => navigate(-1)}
        variant="contained"
        color="primary" // Use primary color
        style={{ marginBottom: 16 }}
        startIcon={<ReplyAllIcon />}

      >
        RETOUR
      </Button>
      <Box sx={{ height: 1000, width: "100%" }}>

      <DataGrid
        rows={consommations}
        columns={columns}
        // @ts-ignore
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.idConsommation}
      />
      </Box>
    </div>
  );
};

export default Consommations;
