import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { ip } from 'constants/ip';

const Emprunt = () => {
  const [emprunts, setEmprunts] = useState([]);

  useEffect(() => {
    // Fetch emprunts from your API
    axios.get(ip + '/emprunt') // Adjust the URL to your API endpoint
      .then(response => {
        setEmprunts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the emprunts!', error);
      });
  }, []);
  const rows = emprunts.map((emprunt, index) => ({
    id: index,
    ...emprunt,
    'fullName': emprunt?.utilisateur?.fullName,
    'numeroSerie': emprunt?.materiel?.numeroSerie,
    'categorie': emprunt?.materiel?.categorie,
    'marque' : emprunt?.materiel?.marque,
  }));
  const columns = [
    { field: 'idUtilisateur', headerName: 'ID Utilisateur', width: 150 },
    { field: 'fullName', headerName: 'Nom Employé', width: 150 },
    { field: 'numeroSerie', headerName: 'Numéro Série', width: 150 },
    { field: 'categorie', headerName: 'Categorie', width: 150 },
    { field: 'marque', headerName: 'Marque', width: 150 },
    { field: 'dateEmprunt', headerName: 'Date Emprunt', width: 200 },
    { field: 'dateRestitution', headerName: 'Date Restitution', width: 200 },
    { field: 'refProjet', headerName: 'Référence Projet', width: 200 },
    { field: 'etatMatRestitution', headerName: 'État Matériel Restitution', width: 200 },
    // Add more columns as needed
  ];

  // Ensure each row has a unique id
  

  return (
    
    <div style={{ height: 600, width: '100%' }}>
      
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

export default Emprunt;
