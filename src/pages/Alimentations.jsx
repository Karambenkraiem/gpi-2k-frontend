import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { ip } from 'constants/ip';
import ReplyAllIcon from "@mui/icons-material/ReplyAll";

const Alimentations = () => {
  const [alimentations, setAlimentations] = useState([]);

  useEffect(() => {
    axios.get(ip + '/alimentation')
      .then(response => {
        setAlimentations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the alimentations!', error);
      });
  }, []);

  const columns = [
    { field: 'idAlimentation', headerName: 'ID', width: 90 },
    { field: 'idSociete', headerName: 'ID Societe', width: 150 },
    { field: 'refArt', headerName: 'Reference Article', width: 150 },
    { field: 'dateAlimentation', headerName: 'Date Alimentation', width: 200 },
    { field: 'quantiteAlimente', headerName: 'Quantite Alimente', width: 150 },
  ];
  const navigate = useNavigate();
  return (
    
    <div style={{ height: 400, width: '100%' }}>
        <Button
        onClick={() => navigate(-1)}
        variant="contained"
        color="primary" // Use primary color
        style={{ marginBottom: 16 }}
      >
        <ReplyAllIcon/>  Back
      </Button>
      <DataGrid
        rows={alimentations}
        columns={columns}
        // @ts-ignore
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.idAlimentation}
      />
    </div>
  );
};

export default Alimentations;
