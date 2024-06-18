import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Affectations = () => {
  const [affectations, setAffectations] = useState([]);

  useEffect(() => {
    // Fetch affectations from your API
    axios.get('http://localhost:3000/affectation') 
      .then(response => {
        setAffectations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the affectations!', error);
      });
  }, []);

  const columns = [
    { field: 'idUtilisateur', headerName: 'ID Utilisateur', width: 150 },
    { field: 'numeroSerie', headerName: 'Numéro Série', width: 150 },
    { field: 'dateAttribution', headerName: 'Date Attribution', width: 200 },
    { field: 'dateRetour', headerName: 'Date Retour', width: 200 },
    { field: 'motifRetour', headerName: 'Motif Retour', width: 200 },

    
  ];

  // Ensure each row has a unique id
  const rows = affectations.map((affectation, index) => ({
    id: index,
    ...affectation,
  }));

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default Affectations;
