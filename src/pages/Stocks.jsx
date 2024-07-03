// @ts-ignore
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import StockModal from "../components/StockModal";
import { ip } from "constants/ip";
import { useNavigate } from "react-router-dom";
import AlimentationModal from "../components/AlimentationModal";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ConsommationModal from "components/ConsommationModal";
import RemoveIcon from "@mui/icons-material/Remove";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openAlimentationModal, setOpenAlimentationModal] = useState(false);
  const [openConsommationModal, setOpenConsommationModal] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  const fetchStocks = () => {
    axios
      .get(ip + "/stocks")
      .then((response) => {
        setStocks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data", error);
      });
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // @ts-ignore
  // const [stockToSave, setStockToSave] = useState({
  //   refArt: "",
  // });

  const handleEdit = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const [alimentationData, setAlimentationData] = useState({
    refArt: "",
    idSociete: "",
    dateAlimentation: "",
    quantiteAlimente: "",
    quantiteStock: "",
  });
  const [consommationData, setConsommationData] = useState({
    idUtilisateur: "",
    numeroSerie: "",
    refArt: "",
    quantiteConsomme: "",
    dateConsomation: "",
    quantiteStock: "",
  });

  const handleAlimentation = (row) => {
    setAlimentationData(row);
    setOpenAlimentationModal(true);
  };
  const handleConsommation = (row) => {
    setConsommationData(row);
    setOpenConsommationModal(true);
  };

  const handleHistoriqueAlimentation = () => {
    Navigate("/alimentations");
  };

  const handleHistoriqueConsommation = () => {
    Navigate("/consommations");
  };

  const handleAdd = () => {
    setEditItem(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
    axios
      .get(ip + "/stocks")
      .then((response) => setStocks(response.data))
      .catch((error) => console.error("Error fetching stocks:", error));
  };

  const handleCloseAlimenterModal = () => {
    setOpenAlimentationModal(false);
    axios
      .get(ip + "/stocks")
      .then((response) => setStocks(response.data))
      .catch((error) => console.error("Error fetching stocks:", error));
  };

  const handleSaveConsommation = () => {
    const qteActuelle = parseInt(consommationData.quantiteStock, 10);
    const qteConsomme = parseInt(consommationData.quantiteConsomme, 10);
    const nouvelleQte = qteActuelle - qteConsomme;
    Promise.all([
      axios.post(ip + "/consommation", {
        idUtilisateur: consommationData.idUtilisateur,
        numeroSerie: consommationData.numeroSerie,
        refArt: consommationData.refArt,
        dateConsomation: consommationData.dateConsomation,
        quantiteConsomme: qteConsomme,
      }),
      axios.patch(ip + `/stocks/${consommationData.refArt}`, {
        quantiteStock: nouvelleQte,
      }),
    ])
      .then((response) => {
        fetchStocks();
        setOpenConsommationModal(false);
      })
      .catch((error) => {
        console.error("Erreur alimentation ou mise à jour du stock:", error);
      });
  };

  const handleSaveAlimentation = () => {
    const qteActuelle = parseInt(alimentationData.quantiteStock, 10);
    const qteAlimente = parseInt(alimentationData.quantiteAlimente, 10);
    const nouvelleQte = qteActuelle + qteAlimente;

    Promise.all([
      axios.post(ip + "/alimentation", {
        idSociete: alimentationData.idSociete,
        refArt: alimentationData.refArt,
        dateAlimentation: alimentationData.dateAlimentation,
        quantiteAlimente: qteAlimente,
      }),
      axios.patch(ip + `/stocks/${alimentationData.refArt}`, {
        quantiteStock: nouvelleQte,
      }),
    ])
      .then((response) => {
        fetchStocks();
        setOpenAlimentationModal(false);
      })
      .catch((error) => {
        console.error("Erreur alimentation ou mise à jour du stock:", error);
      });
  };
  const handleView = (id) => {
    Navigate(`/detailsStock/${id}`);
  };
  const columns = [
    { field: "refArt", headerName: "Référence", width: 150 },
    { field: "categorie", headerName: "Catégorie", width: 150 },
    { field: "marque", headerName: "Marque", width: 150 },
    { field: "modele", headerName: "Modèle", width: 150 },
    { field: "prix", headerName: "Prix", width: 100, type: "number" },
    {
      field: "quantiteStock",
      headerName: "Quantité en Stock",
      width: 150,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign:"center",
      align:"right",
      width: 450,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            title="Voir détails article"
            onClick={() => handleView(params.row.refArt)}
            
          >
            <VisibilityOutlinedIcon />
          </IconButton>
          <IconButton color="primary" 
          title="Modifier l'article"
          onClick={() => handleEdit(params.row)}>
            <EditNoteIcon />
          </IconButton>

          <Button
            // variant="contained"
            color="primary"
            title="Alimenter le stock"
            startIcon={<AddIcon />}
            onClick={() => handleAlimentation(params.row)}
            sx={{color:"green"}}
          >
            Alimenter
          </Button>
          <Button
            // variant="contained"            
            color="secondary"
            onClick={() => handleConsommation(params.row)}
            sx={{color:"red"}}
            title="consommer les accessoires et consommables"
            startIcon={<RemoveIcon />}
          >
            Consommer
          </Button>
        </>
      ),
    },
  ];

  const handleChangeAlimentation = (e) => {
    const { name, value } = e.target;
    setAlimentationData({
      ...alimentationData,
      [name]: value,
    });
  };
  const handleChangeConsommation = (e) => {
    const { name, value } = e.target;
    setConsommationData({
      ...consommationData,
      [name]: value,
    });
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <h1>Gestion de stock des consommables et accessoires</h1>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          style={{ marginRight: 16 }}
        >
          Ajouter Article
        </Button>

        <Box display="flex" gap={2}>
          <Button
            // variant="contained"
            color="primary"
            startIcon={<HistoryOutlinedIcon />}
            onClick={handleHistoriqueAlimentation}
          >
            Historique Alimentation
          </Button>
          <Button
            // variant="contained"
            color="primary"
            startIcon={<HistoryOutlinedIcon />}
            onClick={handleHistoriqueConsommation}
          >
            Historique Consommation
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={stocks}
          // @ts-ignore
          columns={columns}
          loading={loading}
          getRowId={(row) => row.refArt}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          pageSizeOptions={[5,10,25, 50, 100]}
          disableRowSelectionOnClick

        />
      </Box>
      <StockModal
        open={openModal}
        handleClose={handleCloseModal}
        editItem={editItem}
      />
      <AlimentationModal
        alimentationData={alimentationData}
        openAlimentationModal={openAlimentationModal}
        handleClose={() => setOpenAlimentationModal(false)}
        handleChange={handleChangeAlimentation}
        handleSaveAlimentation={handleSaveAlimentation}
      />
      <ConsommationModal
        consommationData={consommationData}
        openConsommationModal={openConsommationModal}
        handleClose={() => setOpenConsommationModal(false)}
        handleChange={handleChangeConsommation}
        handleSaveConsommation={handleSaveConsommation}
      />
    </div>
  );
};

export default Stocks;
