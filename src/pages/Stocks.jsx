import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import StockModal from '../components/StockModal';
import AlimenterModal from '../components/AlimenterModal';
import { ip } from 'constants/ip';
import { useNavigate } from 'react-router-dom';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openAlimenterModal, setOpenAlimenterModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRefArt, setSelectedRefArt] = useState(null);
  const navigate = useNavigate();

  const [stockToSave, setStockToSave] = useState({
    refArt: "",
  });

  useEffect(() => {
    axios
      .get(ip + "/stocks")
      .then((response) => {
        setStocks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data", error);
      });
  }, );

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
    navigate(`/detailsStock/${refArt}`);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleArchive = (refArt) => {
    // Implement archiving logic
    console.log('Archive:', refArt);
  };

  const handleAlimenter = (refArt) => {
    setSelectedRefArt(refArt);
    setOpenAlimenterModal(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
    axios.get(ip + "/stocks")
      .then(response => setStocks(response.data))
      .catch(error => console.error('Error fetching stocks:', error));
  };

  const handleCloseAlimenterModal = () => {
    setOpenAlimenterModal(false);
    setSelectedRefArt(null);
    axios.get(ip + "/stocks")
      .then(response => setStocks(response.data))
      .catch(error => console.error('Error fetching stocks:', error));
  };

  const handleSaveQuantity = (quantity) => {
    const stockItem = stocks.find(stock => stock.refArt === selectedRefArt);
    const updatedQuantity = stockItem.quantiteStock + quantity;
    const url = `${ip}/stocks/${selectedRefArt}`;
    axios.patch(url, { quantiteStock: updatedQuantity })
      .then(response => {
        setStocks(stocks.map(stock => stock.refArt === selectedRefArt ? { ...stock, quantiteStock: updatedQuantity } : stock));
      })
      .catch(error => console.error('Error updating quantity:', error));
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
        loading={loading}
        pageSize={10}
        getRowId={(row) => row.refArt}
      />
      <StockModal
        open={openModal}
        handleClose={handleCloseModal}
        editItem={editItem}
      />
      <AlimenterModal
        open={openAlimenterModal}
        handleClose={handleCloseAlimenterModal}
        refArt={selectedRefArt}
        onSave={handleSaveQuantity}
      />
    </div>
  );
};

export default Stocks;
