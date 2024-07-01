import { Button, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { ip } from "constants/ip";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import LogicielModal from "components/LogicielModal";
import { useNavigate } from "react-router-dom";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AddIcon from "@mui/icons-material/Add";

const Logiciels = () => {
  const [logiciels, setLogiciels] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [logicielData, setLogicielData] = useState({
    idLogiciel: "",
    libelle: "",
    version: "",
    editeur: "",
    dateAcquisition: "",
    typeLogiciel: "",
    idSociete: "",
  });
  const typeLogiciel = {
    bureautique: "Bureautique",
    technique: "Technique",
  };
  const fetchLogiciels = () => {
    axios
      .get(`${ip}/logiciels`)
      .then((response) => {
        setLogiciels(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchLogiciels();
  }, []);

  const handleOpen = (logiciel = null) => {
    if (logiciel) {
      setLogicielData(logiciel);
      setIsEditing(true);
    } else {
      setLogicielData({
        idLogiciel: "",
        libelle: "",
        version: "",
        editeur: "",
        dateAcquisition: "",
        typeLogiciel: "",
        idSociete: "",
      });
      setIsEditing(false);
    }
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogicielData({ ...logicielData, [name]: value });
    validate(name, value);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSave = () => {
    if (isEditing) {
      axios
        .patch(`${ip}/logiciels/${parseInt(logicielData.idLogiciel, 10)}`, {
          libelle: logicielData.libelle,
          version: logicielData.version,
          editeur: logicielData.editeur,
          dateAcquisition: logicielData.dateAcquisition,
          typeLogiciel: logicielData.typeLogiciel,
          idSociete: logicielData.idSociete,
        })
        .then((response) => {
          setLogiciels(response.data);
          fetchLogiciels();
          handleClose();
        })
        .catch((error) =>
          console.error("Probleme modification Materiel", error)
        );
    } else {
      axios
        .post(`${ip}/logiciels`, {
          libelle: logicielData.libelle,
          version: logicielData.version,
          editeur: logicielData.editeur,
          dateAcquisition: logicielData.dateAcquisition,
          typeLogiciel: logicielData.typeLogiciel,
          idSociete: logicielData.idSociete,
        })
        .then((response) => {
          setLogiciels([...logiciels, response.data]);
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout logiciel!");
        });
    }
  };

  const handleView = (id) => {
    navigate(`/detailsLogiciel/${id}`);
  };

  const handleEdit = (rowData) => {
    setLogicielData(rowData);
    setIsEditing(true);
    setOpenModal(true);
  };

  const validate = (name, value) => {
    let errorMsg = "";
    if (name === "idUtilisateur" && !value) {
      errorMsg = "Matricule est obligatoire !!!";
    } else if (name === "fullName" && !value) {
      errorMsg = "Nom & Prénom est obligatoire";
    } else if (name === "password" && !value) {
      errorMsg = "Mot de Passe est obligatoire";
    } else if (name === "email" && (!value || !/\S+@\S+\.\S+/.test(value))) {
      errorMsg = "Email n'est pas valide";
    } else if (name === "idSpecialite" && !value) {
      errorMsg = "Specialité est obligatoire";
    } else if (name === "roleUtilisateur" && !value) {
      errorMsg = "Role est obligatoire";
    } else if (name === "etatUtilisateur" && !value) {
      errorMsg = "Etat est obligatoire";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const columns = [
    { field: "idLogiciel", headerName: "Identifiant", width: 100 },
    { field: "typeLogiciel", headerName: "Catégorie", width: 150 },
    { field: "libelle", headerName: "Désignation", width: 400 },
    { field: "version", headerName: "Version", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 400,
      renderCell: (params) => (
        <div text-align="left">
          <Button
            title="Voir détails logiciel"
            onClick={() => handleView(params.row.idLogiciel)}
          >
            <VisibilityOutlinedIcon />
          </Button>
          <Button
            title="Modifier logiciel"
            onClick={() => handleEdit(params.row)}
          >
            <EditNoteIcon />
          </Button>
          
        </div>
      ),
    },
  ];

  const handleHistoriqueInstallations = () => {
    navigate(`/installations`);
  };

  return (
    <div>
      <h1>Gestion des logiciels</h1>
      <Box sx={{ height: 560, width: "100%" }}>
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
            onClick={() => handleOpen(null)}
            style={{ marginRight: 16 }}
          >
            Ajouter Logiciel
          </Button>
          <Box display="flex" gap={2}>
            <Button
              // variant="contained"
              color="primary"
              startIcon={<HistoryOutlinedIcon />}
              onClick={handleHistoriqueInstallations}
            >
              Historique des installations
            </Button>
          </Box>
        </Box>

        <LogicielModal
          openModal={openModal}
          isEditing={isEditing}
          logicielData={logicielData}
          handleChange={handleChange}
          handleSave={handleSave}
          handleClose={handleClose}
        />

        <DataGrid
          rows={logiciels}
          // @ts-ignore
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          pagination
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          // @ts-ignore
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          getRowId={(row) => row.idLogiciel}
        />
      </Box>
    </div>
  );
};

export default Logiciels;
