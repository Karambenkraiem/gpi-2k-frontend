// @ts-ignore
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
import { useNavigate } from 'react-router-dom';
import AlimentationModal from '../components/AlimentationModal';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openAlimentationModal, setOpenAlimentationModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRefArt, setSelectedRefArt] = useState(null);
  const Navigate = useNavigate();
  
  

const fetchStocks = () =>{
  axios
  .get(ip + "/stocks")
  .then((response) => {
    setStocks(response.data);
    setLoading(false);
  })
  .catch((error) => {
    console.error("Error Fetching Data", error);
  });
}





  useEffect(() => {
    fetchStocks();
      
  },[]);


  // @ts-ignore
  const [stockToSave, setStockToSave] = useState({
    refArt: "",
  });
  
  const handleEdit = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleArchive = (refArt) => {
    axios.delete(ip+"/stocks/"+refArt)
    .then(response => setStocks(response.data))
      .catch(error => console.error('Error fetching stocks:', error));;
    
    console.log('Archive:', refArt);
  };

  const [alimentationData,setAlimentationData]=useState({
    idAlimentation:"",
    idSociete:"",
    refArt:"",
    dateAlimentation:"",
    quantiteAlimente:0,
  })





  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setAlimentationData({
        ...alimentationData,
        quantiteAlimente: value,
      });
    }
  };





  const handleAlimentation = (refArt) => {
    setAlimentationData({ ...alimentationData,refArt})
    setOpenAlimentationModal(true);
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
    setOpenAlimentationModal(false);
    setSelectedRefArt(null);
    axios.get(ip + "/stocks")
      .then(response => setStocks(response.data))
      .catch(error => console.error('Error fetching stocks:', error));
  };

  const handleSaveAlimentation= () => {
    axios.post(ip+"/alimentation",alimentationData)
    .then((response)=>{
      fetchStocks();
      setOpenAlimentationModal(false);
    })
    .catch((error)=> console.error("Erreur alimentation!!",error));
  }

  const handleView = (id) => {
    Navigate(`/detailsStock/${id}`);
  };

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
            onClick={() => handleAlimentation(params.row.refArt)}
          >
            Alimenter
          </Button>
        </>
      ),
    },
  ];

  const handleChangeAlimentation=(e)=>{
    const {name,value}=e.target;
    setAlimentationData({
      ...alimentationData,
      [name]:value,
    })
  }

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
        // @ts-ignore
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
      <AlimentationModal
        alimentationData={alimentationData}
        openAlimentationModal={openAlimentationModal}
        handleClose={()=>setOpenAlimentationModal(false)}
        handleChange={handleChangeAlimentation}
        handleSave={handleSaveAlimentation}
        refArt={selectedRefArt}
        isEditing={isEditing}

      />
    </div>
  );
};

export default Stocks;
