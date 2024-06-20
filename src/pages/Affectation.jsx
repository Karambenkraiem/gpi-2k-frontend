import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { ip } from 'constants/ip';

const Affectations = () => {
  const [affectations, setAffectations] = useState([]);

  useEffect(() => {
    // Fetch affectations from your API
    axios.get(ip + '/affectation') 
      .then(response => {
        setAffectations(response.data);
      })
      .catch(error => {
        console.error('Erreur récupération de données', error);
      });
  }, []);

  const rows = affectations.map((affectation, index) => ({
    id: index,
    ...affectation,
    'fullName': affectation?.utilisateur?.fullName,
    'numeroSerie': affectation?.materiel?.numeroSerie,
    'categorie': affectation?.materiel?.categorie,
    'marque' : affectation?.materiel?.marque,

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
            <h1>Historique des Affectations</h1>

      <DataGrid
        rows={rows}
        columns={columns}
        // @ts-ignore
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default Affectations;
