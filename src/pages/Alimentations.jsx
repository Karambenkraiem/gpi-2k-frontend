import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ip } from 'constants/ip';
import ReplyAllIcon from "@mui/icons-material/ReplyAll";




const Alimentations = () => {
  const [alimentations, setAlimentations] = useState([]);

  useEffect(() => {
    axios.get(ip + '/alimentation')
      .then(response => {
        const transformedData = response.data.map(item => ({
          ...item,
          raisonSociale: item.Societe?.raisonSociale || 'N/A',
          categorie:item.Stocks?.categorie,
          dateAlimentation: item.dateAlimentation
          ? new Date(item.dateAlimentation).toLocaleDateString('fr-FR') 
          : "-",

        }));
        setAlimentations(transformedData);
      })
      .catch(error => {
        console.error('There was an error fetching the alimentations!', error);
      });
  }, []);
  console.log(alimentations)

  const columns = [
    { field: 'idAlimentation', headerName: 'Identifiant', width: 90 },
    { field: 'raisonSociale', headerName: 'Nom de Societe', width: 150 }, 
    { field: 'refArt', headerName: 'Reference Article', width: 150 },
    { field: 'categorie', headerName: 'Article', width: 150 },
    { field: 'dateAlimentation', headerName: 'Date Alimentation', width: 200 },
    { field: 'quantiteAlimente', headerName: 'Quantite Alimente',headerAlign:"center", align:"center", width: 150 },
  ];
  const navigate = useNavigate();
  return (
    
    <div style={{ height: 400, width: '100%' }}>

    <h1>Historique d'alimentation stock</h1>


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
        rows={alimentations}
        // @ts-ignore
        columns={columns}
        getRowId={(row) => row.idAlimentation}
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

export default Alimentations;
