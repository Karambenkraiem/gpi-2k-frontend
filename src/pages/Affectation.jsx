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
  const rows = affectations.map((affectation, index) => ({
    id: index,
    ...affectation,
    'fullName': affectation.utilisateur.fullName,
    'numeroSerie': affectation.materiel.numeroSerie,
    'categorie': affectation.materiel.categorie,
    'marque' : affectation.materiel.marque,

  }));
  const columns = [
    { field: 'idUtilisateur', headerName: 'ID Utilisateur', width: 150 },
    { field: 'fullName', headerName: 'Nom Employé', width: 150 },
    { field: 'numeroSerie', headerName: 'Numéro Série Meteriel', width: 150 },
    { field: 'categorie', headerName: 'Categorie', width: 150 },
    { field: 'marque', headerName: 'Marque', width: 150 },
    { field: 'dateAttribution', headerName: 'Date Attribution', width: 200 },
    { field: 'dateRetour', headerName: 'Date Retour', width: 200 },
    { field: 'motifRetour', headerName: 'Motif Retour', width: 200 },
  ];

 
  

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
