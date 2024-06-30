import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, IconButton } from '@mui/material';
import axios from 'axios';
import { ip } from 'constants/ip';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SocieteModal from '../components/SocieteModal';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from 'react-router-dom';

const Societes = () => {
  const [societes, setSocietes] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchSocietes = () => {
    axios.get(ip + "/societe")
      .then(response => {
        setSocietes(response.data);
      })
      .catch(error => {
        console.error('Error fetching societes data:', error);
      });
  };

  useEffect(() => {
    fetchSocietes();
  }, []);

  const handleAddSociete = () => {
    setEditItem(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
    fetchSocietes(); // Fetch the updated list after closing the modal
  };

  const handleEditSociete = (societe) => {
    setEditItem(societe);
    setOpenModal(true);
  };
  const Navigate = useNavigate();

  const handleViewSociete = (idSociete) => {
    Navigate(`/detailsSociete/${idSociete}`);

    console.log('View Societe:', idSociete);
  };

  const handleDeleteSociete = (idSociete) => {
    axios.delete(`${ip}/societe/${idSociete}`)
      .then(() => {
        fetchSocietes();
      })
      .catch(error => {
        console.error('Error deleting societe:', error);
      });
  };

  const columns = [
    { field: 'idSociete', headerName: 'ID', width: 90 },
    { field: 'raisonSociale', headerName: 'Raison Sociale', width: 200 },
    // { field: 'adresse', headerName: 'Adresse', width: 200 },
    { field: 'responsable', headerName: 'Responsable', width: 150 },
    // { field: 'email', headerName: 'Email', width: 200 },
    { field: 'numtel', headerName: 'Numéro Téléphone', width: 150 },
    { field: 'secteurActivite', headerName: 'Secteur Activité', width: 150 },
    { field: 'typeSociete', headerName: 'Type Société', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button onClick={() => handleViewSociete(params.row.idSociete)}>
            <VisibilityOutlinedIcon />
          </Button>
          <Button onClick={() => handleEditSociete(params.row)}>
            <EditNoteIcon />
          </Button>
          <Button onClick={() => handleDeleteSociete(params.row.idSociete)}>
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <div>
      <Box >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddSociete}
          style={{ marginBottom: 16 }}
        >
          Ajouter Societé
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={societes}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.idSociete}
        />
      </Box>
      <SocieteModal
        open={openModal}
        handleClose={handleCloseModal}
        editItem={editItem}
      />
    </div>
  );
};

export default Societes;
