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
        const transformedData = response.data.map(item => ({
          ...item,
          fullName: item.Utilisateur?.fullName,
          categorie:item.Stocks?.categorie,
          dateConsommation: new Date(item.dateConsommation).toLocaleDateString('fr-FR') // Format date

        }));
        setConsommations(transformedData);
      })
      .catch(error => {
        console.error('There was an error fetching the alimentations!', error);
      });
  }, []);

  const columns = [
    { field: 'idConsommation', headerName: 'Identifiant', width: 90 },
    { field: 'fullName', headerName: 'Utilisateur', width: 150 },
    { field: 'refArt', headerName: 'Reference Article', width: 150 },
    { field: 'categorie', headerName: 'Article', width: 150 },
    { field: 'dateConsommation', headerName: 'Date Consommation', width: 200 },
    { field: 'quantiteConsomme', headerName: 'Quantite Consomme', width: 150 },
  ];
  const navigate = useNavigate();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h1>Historique des consommation des articles de stock</h1>
       <Button
        onClick={() => navigate(-1)}
        variant="contained"
        color="primary" // Use primary color
        style={{ marginBottom: 16 }}
        startIcon={<ReplyAllIcon />}

      >
        RETOUR
      </Button>
      <Box sx={{ height: 500, width: "100%" }}>

      <DataGrid
        rows={consommations}
        // @ts-ignore
        columns={columns}
        getRowId={(row) => row.idConsommation}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}       
        pageSizeOptions={[5,10,25, 50, 100]}
        disableRowSelectionOnClick

      />
      </Box>
    </div>
  );
};

export default Consommations;
