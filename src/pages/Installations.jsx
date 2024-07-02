import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ip } from "constants/ip";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import { Container } from "react-bootstrap";
import AssignmentReturnSharpIcon from "@mui/icons-material/AssignmentReturnSharp";
import InstallLicenceModal from "components/InstallLicenceModal";

function Installations() {
  const [installations, setInstallations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openInstallModal, setOpenInstallModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [materialDetails, setMaterialDetails] = useState("");
  const [installationData, setInstallationData] = useState({
    idInstallation:"",
    numeroLicence: "",
    idLicence: "",
    numeroSerie: "",
    dateInstallation: "",
    dateDesinstallation: "",
    etatOperation:"",
    statutLicence: "",
  });

  const fetchInstallations = () => {
    axios
      .get(ip + "/installation")
      .then((response) => {
        setInstallations(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the alimentations!", error);
      });
  };

  const handleMouseEnter = async (numeroSerie) => {
    try {
      const response = await axios.get(`${ip}/materiel/${numeroSerie}`);
      const materielDetails = response.data; // Supposons que response.data contient toutes les informations nécessaires
      const detailsText = `Marque: ${materielDetails.marque}, Modèle: ${materielDetails.modele}, Processeur: ${materielDetails.processeur}, RAM: ${materielDetails.ram}, Disque: ${materielDetails.disque}`;
      setMaterialDetails(detailsText);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du matériel",
        error
      );
      setMaterialDetails("Détails non disponibles");
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  const handleSaveInstallation = () => {
    if (isEditing) {
      Promise.all([
        axios.patch(`${ip}/installation/${parseInt(installationData.idInstallation)}`, {
          dateDesinstallation: installationData.dateDesinstallation,
          etatOperation:"Désinstallée"
        }),
        axios.patch(`${ip}/licence/${parseInt(installationData.idLicence)}`, {
          statutLicence: installationData.statutLicence
          }),
      ])
        .then((response1, response2) => {
          handleClose();
        })
        .catch((error) =>
          console.error("Probleme modification de la licence", error)
        );
    } else {
      Promise.all([
        axios.post(`${ip}/installation`, {
          idLicence: installationData.idLicence,
          numeroSerie: installationData.numeroSerie,
          dateInstallation: installationData.dateInstallation,
          dateDesinstallation: null,
          etatOperation:"En cours d'utilisation"
        }),
        axios.patch(`${ip}/licence/${parseInt(installationData.idLicence)}`, {
          statutLicence: installationData.statutLicence,
        }),
      ])
        .then((response1, response2) => {
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout de la licence!");
        });
    }
  };

  const handleEdit = (row) => {
    setInstallationData(row);
    setIsEditing(true);
    setOpenInstallModal(true);
  };

  const handleClose = () => {
    setOpenInstallModal(false);
    fetchInstallations();
    setOpenModal(false);
  };

  const rows = installations.map((installation, index) => ({
    id: index,
    ...installation,
    numeroLicence: installation?.Licence?.numeroLicence,
    statutLicence: installation?.Licence?.statutLicence,
  }));

  const columns = [
    { field: "idInstallation", headerName: "ID", width: 50 },
    { field: "idLicence", headerName: "ID licence", width: 90 },
    { field: "numeroLicence", headerName: "N° licence", width: 150 },
    //{ field: "numeroSerie", headerName: "Numero Série Materiel", width: 150 },
    {
      field: "numeroSerie",
      headerName: "Numero Série Materiel",
      width: 150,
      renderCell: (params) => (
        <div
          onMouseEnter={() => handleMouseEnter(params.row.numeroSerie)}
          title={materialDetails || "Aucun détail disponible"}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "dateInstallation",
      headerName: "Date d'installation",
      width: 200,
    },
    {
      field: "dateDesinstallation",
      headerName: "Date de désinstallation",
      width: 150,
    },
    {
      field: "etatOperation",
      headerName: "Statut",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => (
        <div text-align="left">
          <Button
            title="Désinstaller Matériel"
            disabled={params.row.dateDesinstallation !== null}
            onClick={() => handleEdit(params.row)}
          >
            <AssignmentReturnSharpIcon />
          </Button>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();

  const handleChangeInstall = (e) => {
    const { name, value } = e.target;
    setInstallationData({ ...installationData, [name]: value });
  };

  return (
    <div style={{ height: 1000, width: "100%" }}>
      <Container className="py-4">
      <Button
        onClick={() => navigate(-1)}
        variant="contained"
        color="primary" // Use primary color
        style={{ marginBottom: 16 }}
        startIcon={<ReplyAllIcon />}

      >
        RETOUR
      </Button>
      </Container>

      <InstallLicenceModal
        openInstallModal={openInstallModal}
        handleClose={handleClose}
        isEditing={isEditing}
        installationData={installationData}
        handleChange={handleChangeInstall}
        handleSave={handleSaveInstallation}
      />

      <DataGrid
        rows={rows}
        // @ts-ignore
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}

export default Installations;
