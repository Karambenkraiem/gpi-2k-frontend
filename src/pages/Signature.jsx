import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ip } from 'constants/ip';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

const Signature = () => {
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    axios.get(`${ip}/signature`)
      .then(response => {
        const transformedData = response.data.map(item => ({
          ...item,
          dateSignature: item.dateSignature ? new Date(item.dateSignature).toLocaleDateString('fr-FR') : '-',
          societeName: item.Societe ? item.Societe.raisonSociale : '-',
          contratDescription: item.Contrat ? item.Contrat.descriptionContrat : '-',
        }));
        setSignatures(transformedData);
      })
      .catch(error => {
        console.error('There was an error fetching the signatures!', error);
      });
  }, []);




  const columns = [
    { field: 'idSignature', headerName: 'ID Signature', width: 150 },
    { field: 'societeName', headerName: 'Nom de Société', width: 150 },
    { field: 'contratDescription', headerName: 'Description du Contrat', width: 200 },
    { field: 'dateSignature', headerName: 'Date de Signature', width: 200 },
  ];

  const navigate = useNavigate();

  return (
    <div style={{ height: 400, width: '100%' }}>
        <h1>Historique des signature des contrats</h1>
      <Button
        onClick={() => navigate(-1)}
        variant="contained"
        color="primary"
        style={{ marginBottom: 16 }}
        startIcon={<ReplyAllIcon />}
      >
        RETOUR
      </Button>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={signatures}
          columns={columns}
          getRowId={(row) => row.idSignature}
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

export default Signature;
