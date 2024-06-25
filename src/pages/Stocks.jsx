import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import StockModal from '../components/StockModal';
import { ip } from 'constants/ip';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    axios.get(ip + "/stocks")
      .then(response => setStocks(response.data))
      .catch(error => console.error('Error fetching stocks:', error));
  }, []);

  const columns = [
    { field: 'refArt', headerName: 'Référence', width: 150 },
    { field: 'marque', headerName: 'Marque', width: 150 },
    { field: 'modele', headerName: 'Modèle', width: 150 },
    { field: 'prix', headerName: 'Prix', width: 100, type: 'number' },
    { field: 'quantiteStock', headerName: 'Quantité en Stock', width: 150, type: 'number' },
    { field: 'categorie', headerName: 'Catégorie', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleView(params.row.refArt)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleArchive(params.row.refArt)}>
            <ArchiveIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleAlimenter(params.row.refArt)}
          >
            Alimenter
          </Button>
        </>
      ),
    },
  ];

  const handleView = (refArt) => {
    // Implémentez la logique de visualisation
    console.log('View:', refArt);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleArchive = (refArt) => {
    // Implémentez la logique d'archivage
    console.log('Archive:', refArt);
  };

  const handleAlimenter = (refArt) => {
    // Implémentez la logique d'alimentation
    console.log('Alimenter:', refArt);
  };

  const handleAdd = () => {
    setEditItem(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
    // Actualiser les données après fermeture du modal
    axios.get('/api/stocks')
      .then(response => setStocks(response.data))
      .catch(error => console.error('Error fetching stocks:', error));
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Ajouter Article
      </Button>
      <DataGrid
        rows={stocks}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row.refArt}
      />
      <StockModal open={openModal} handleClose={handleCloseModal} editItem={editItem} />
    </div>
  );
};

export default Stocks;
