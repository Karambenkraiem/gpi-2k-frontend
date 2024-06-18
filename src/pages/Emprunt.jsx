import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Emprunt = () => {
  const [emprunts, setEmprunts] = useState([]);

  useEffect(() => {
    // Fetch emprunts from your API
    axios.get('http://localhost:3000/emprunt') // Adjust the URL to your API endpoint
      .then(response => {
        setEmprunts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the emprunts!', error);
      });
  }, []);

  const columns = [
    { field: 'idUtilisateur', headerName: 'ID Utilisateur', width: 150 },
    { field: 'numeroSerie', headerName: 'Numéro Série', width: 150 },
    { field: 'dateEmprunt', headerName: 'Date Emprunt', width: 200 },
    { field: 'dateRestitution', headerName: 'Date Restitution', width: 200 },
    { field: 'refProjet', headerName: 'Référence Projet', width: 200 },
    { field: 'etatMatRestitution', headerName: 'État Matériel Restitution', width: 200 },
    // Add more columns as needed
  ];

  // Ensure each row has a unique id
  const rows = emprunts.map((emprunt, index) => ({
    id: index,
    ...emprunt,
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

export default Emprunt;
