// @ts-ignore
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { ip } from "constants/ip";
import { useNavigate } from "react-router-dom";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ContratModal from "components/ContratModal";
import SignatureModal from "components/SignatureModal";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";

const Contrat = () => {
  const [contrats, setContrats] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openSignatureModal, setOpenSignatureModal] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  const fetchContrats = () => {
    axios
      .get(ip + "/contrat")
      .then((response) => {
        setContrats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data", error);
      });
  };

  useEffect(() => {
    fetchContrats();
  }, []);

  // @ts-ignore
  // const [stockToSave, setStockToSave] = useState({
  //   refArt: "",
  // });

  const handleEdit = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const [signatureData, setSignatureData] = useState({
    idContrat: "",
    idSociete: "",
    dateSignature: "",
    etatContrat: "",
  });

  const handleSignature = (row) => {
    setSignatureData(row);
    setOpenSignatureModal(true);
  };

  const handleHistoriqueSignature = () => {
    Navigate("/signature");
  };

  const handleAdd = () => {
    setEditItem(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
    axios
      .get(ip + "/contrat")
      .then((response) => setContrats(response.data))
      .catch((error) => console.error("Error fetching stocks:", error));
  };

  const handleCloseSignerModal = () => {
    setOpenSignatureModal(false);
    axios
      .get(ip + "/contrats")
      .then((response) => setContrats(response.data))
      .catch((error) => console.error("Error fetching contrats:", error));
  };

  const handleSaveSignature = () => {
    Promise.all([
      axios.post(ip + "/signature", {
        idSociete: signatureData.idSociete,
        idContrat: signatureData.idContrat,
        dateSignature: signatureData.dateSignature,
      }),
      axios.patch(ip + `/contrat/${signatureData.idContrat}`, {
        etatContrat: "actif",
      }),
    ])
      .then((response) => {
        fetchContrats();
        setOpenSignatureModal(false);
      })
      .catch((error) => {
        console.error("Erreur Signature ou mise à jour du Contrat:", error);
      });
  };
  const handleView = (id) => {
    Navigate(`/detailsContrat/${id}`);
  };

  const handleBlockContract = (ContratId) => {
    const contrat = contrats.find((c) => c.idContrat === ContratId);
    if (!contrat) {
      console.error("Données Introuvable !!!");
      return;
    }
    const updatedContrat = {
      ...contrat,
      etatContrat: ["Pret à signer", "actif", "inactif", "suspendu"].includes(
        contrat.etatContrat
      )
        ? "suspendu"
        : contrat.etatContrat,
    };
    const { Signature, ...rest } = updatedContrat;
    axios
      .patch(ip + `/contrat/${ContratId}`, rest)
      .then((response) => {
        setContrats(
          contrats.map((c) => (c.idContrat === ContratId ? response.data : c))
        );
      })
      .catch((error) => {
        console.error("Erreur Suspension contrat !!! ", error);
      });
  };
  const columns = [
    { field: "idContrat", headerName: "Num Contrat", width: 150 },
    { field: "dateDebutContrat", headerName: "Date debut contrat", width: 150 },
    { field: "dateFinContrat", headerName: "date Fin Contrat", width: 150 },
    {
      field: "montantContrat",
      headerName: "Montant",
      width: 100,
      type: "number",
    },
    { field: "etatContrat", headerName: "Etat de contrat", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      width: 300,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            title="Voir détails article"
            onClick={() => handleView(params.row.idContrat)}
          >
            <VisibilityOutlinedIcon />
          </IconButton>

          <Button
            // variant="contained"
            color="primary"
            title="Signer Le contrat"
            onClick={() => handleSignature(params.row)}
            sx={{ color: "green" }}
            disabled={params.row.etatContrat === "suspendu"}
          >
            <HandshakeOutlinedIcon />
          </Button>

          <IconButton
            color="primary"
            title="Modifier le contrat"
            onClick={() => handleEdit(params.row)}
            disabled={params.row.etatContrat === "suspendu"}
          >
            <EditNoteIcon />
          </IconButton>

          <IconButton
            color="primary"
            title="Suspendre le contrat"
            onClick={() => handleBlockContract(params.row.idContrat)}
          >
            <HighlightOffOutlinedIcon sx={{ color: "red" }} />
          </IconButton>
        </>
      ),
    },
  ];

  const handleChangeSignature = (e) => {
    const { name, value } = e.target;
    setSignatureData({
      ...signatureData,
      [name]: value,
    });
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <h1>Gestion des contrats</h1>
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
          Ajouter Contrat
        </Button>

        <Box display="flex" gap={2}>
          <Button
            // variant="contained"
            color="primary"
            startIcon={<HistoryOutlinedIcon />}
            onClick={handleHistoriqueSignature}
          >
            Historique des contrats
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={contrats}
          // @ts-ignore
          columns={columns}
          loading={loading}
          getRowId={(row) => row.idContrat}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableRowSelectionOnClick
        />
      </Box>

      <ContratModal
        open={openModal}
        handleClose={handleCloseModal}
        editItem={editItem}
      />
      <SignatureModal
        signatureData={signatureData}
        openSignatureModal={openSignatureModal}
        handleClose={() => setOpenSignatureModal(false)}
        handleChange={handleChangeSignature}
        handleSaveSignature={handleSaveSignature}
      />
    </div>
  );
};

export default Contrat;
