import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { ip } from "constants/ip";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import LicenceModal from "components/LicenceModal";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import InstallLicenceModal from "components/InstallLicenceModal";

const DetailsLogiciel = () => {
  const { idLogiciel } = useParams();
  const [societies, setSocieties] = useState([]);
  const [logiciels, setLogiciels] = useState([]);
  const [logiciel, setLogiciel] = useState([]);
  const [licences, setLicences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openInstallModal, setOpenInstallModal] = useState(false);
  const navigate = useNavigate();
  const [licenceData, setLicenceData] = useState({
    idLicence: "",
    numeroLicence: "",
    dateActivation: "",
    dateExpiration: "",
    prixLicence: null,
    idLogiciel: idLogiciel,
    statutLicence: "",
  });

  const [installationData, setInstallationData] = useState({
    idLicence: "",
    numeroLicence: "",
    numeroSerie: "",
    dateInstallation: "",
    dateDesinstallation: "",
    statutLicence: "",
  });

  const fetchSocieties = () => {
    axios
      .get(ip + `/societe`)
      .then((response) => {
        setSocieties(response.data);
      })
      .catch((error) => {
        console.error("Erreur récupération sociétés!", error);
      });
  };

  const fetchLogiciels = () => {
    axios
      .get(`${ip}/logiciels`)
      .then((response) => {
        setLogiciels(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchLogiciel = () => {
    axios
      .get(`${ip}/logiciels/${idLogiciel}`)
      .then((response) => {
        setLogiciel(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchLicences();
    fetchLogiciel();
    fetchSocieties();
  });

  const fetchLicences = () => {
    axios
      .get(ip + `/licence/${idLogiciel}`)
      .then((response) => {
        setLicences(response.data);
      })
      .catch((error) => {
        console.error("Erreur récupération de la liste des licences!", error);
      });
  };

  const handleOpen = (licence = null) => {
    if (licence) {
      setLicenceData(licence);
      setIsEditing(true);
    } else {
      setLicenceData({
        idLicence: "",
        numeroLicence: "",
        dateActivation: "",
        dateExpiration: "",
        prixLicence: null,
        idLogiciel: idLogiciel,
        statutLicence: "",
      });
      console.log(idLogiciel);
      setIsEditing(false);
    }
    setOpenModal(true);
  };

  const handleInstallOpen = (licence = null, numLicence = "") => {
    if (licence) {
      setInstallationData(licence);
      setIsEditing(true);
    } else {
      setInstallationData({
        idLicence: "",
        numeroLicence: numLicence,
        numeroSerie: "",
        dateInstallation: "",
        dateDesinstallation: "",
        statutLicence: "",
      });
      console.log(idLogiciel);
      setIsEditing(false);
    }
    setOpenInstallModal(true);
  };

  const handleSave = () => {
    if (isEditing) {
      axios
        .patch(`${ip}/licence/${parseInt(licenceData.idLicence, 10)}`, {
          numeroLicence: licenceData.numeroLicence,
          dateActivation: licenceData.dateActivation,
          dateExpiration: licenceData.dateExpiration,
          prixLicence: parseFloat(licenceData.prixLicence),
          statutLicence: licenceData.statutLicence,
          idLogiciel: parseInt(licenceData.idLogiciel),
        })
        .then((response) => {
          setLicences([...licences, response.data]);
          fetchLicences();
          handleClose();
        })
        .catch((error) =>
          console.error("Probleme modification de la licence", error)
        );
    } else {
      axios
        .post(`${ip}/licence`, {
          numeroLicence: licenceData.numeroLicence,
          dateActivation: licenceData.dateActivation,
          dateExpiration: licenceData.dateExpiration,
          prixLicence: parseFloat(licenceData.prixLicence),
          statutLicence: licenceData.statutLicence,
          idLogiciel: parseInt(licenceData.idLogiciel),
        })
        .then((response) => {
          setLicences([...licences, response.data]);
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout de la licence!");
        });
    }
  };

  const handleSaveInstallation = () => {
    if (isEditing) {
      axios
        .patch(`${ip}/licence/${parseInt(licenceData.idLicence, 10)}`, {
          numeroLicence: licenceData.numeroLicence,
          dateActivation: licenceData.dateActivation,
          dateExpiration: licenceData.dateExpiration,
          prixLicence: parseFloat(licenceData.prixLicence),
          statutLicence: licenceData.statutLicence,
          idLogiciel: parseInt(licenceData.idLogiciel),
        })
        .then((response) => {
          setLicences([...licences, response.data]);
          fetchLicences();
          handleClose();
        })
        .catch((error) =>
          console.error("Probleme modification de la licence", error)
        );
    } else {
      Promise.all([
        axios.post(`${ip}/installation`, {
          numeroLicence: installationData.idLicence,
          dateActivation: installationData.dateInstallation,
        }),
        axios.patch(`${ip}/licence/${parseInt(licenceData.idLicence, 10)}`, {
          statutLicence: licenceData.statutLicence,
        }),
      ])
        .then((response1, response2) => {
          fetchLicences();
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout de la licence!");
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicenceData({ ...licenceData, [name]: value });
  };

  const handleChangeInstall = (e) => {
    const { name, value } = e.target;
    setInstallationData({ ...installationData, [name]: value });
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpenInstallModal(false);
  };

  const nomSociete = societies.find(
    // @ts-ignore
    (society) => society.idSociete === logiciel.idSociete
  )?.raisonSociale;

  const rowsLicences = licences.map((licence, index) => ({
    id: index,
    ...licence,
    numeroSerie: licence.Materiel?.numeroSerie || "N/A",
    categorie: licence.Logiciel?.typeLogiciel || "N/A",
    marque: licence.Materiel?.marque || "N/A",
    disponibilite: licence.Materiel?.disponibilite || "N/A",
  }));

  const columnsLicences = [
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <div text-align="letf">
          <Button
            title="Modifier licence"
            onClick={() => handleOpen(params.row)}
          >
            <EditNoteIcon />
          </Button>
          <Button
            title="Assigner une licence"
            disabled={
              params.row.disponibilite === "Affecté" ||
              params.row.disponibilite === "Emprunté"
            }
            onClick={() => handleInstallOpen(null, params.row.numeroLicence)}
          >
            <InstallDesktopIcon />
          </Button>
          <Button
            title="Retirer une licence"
            disabled={
              params.row.disponibilite === "Affecté" ||
              params.row.disponibilite === "Emprunté"
            }
            onClick={() => handleInstallOpen(params.row)}
          >
            <RestorePageIcon />
          </Button>
        </div>
      ),
    },

    { field: "idLicence", headerName: "#ID", width: 50 },
    { field: "numeroLicence", headerName: "N° Licence", width: 300 },
    { field: "statutLicence", headerName: "Statut", width: 100 },
    { field: "dateActivation", headerName: "Date Activation", width: 150 },
    { field: "dateExpiration", headerName: "Date expiration", width: 150 },
    { field: "prixLicence", headerName: "Prix en DT", width: 150 },
  ];

  return (
    <div>
      <h1>Details logiciels</h1>
      <section style={{ backgroundColor: "#eee" }}>
        <Container className="py-4">
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            color="primary" // Use primary color
            style={{ marginBottom: 16 }}
          >
            <ReplyAllIcon /> Back
          </Button>

          <Row>
            <Col lg={4}>
              <Card className="mb-1">
                <Card.Body className="text-left">
                  <h6 className="my-1">
                    <b>
                      {
                        // @ts-ignore
                        "Logiciel " + logiciel?.typeLogiciel
                      }
                    </b>
                  </h6>
                  <h6 className="my-4">
                    <b>
                      {
                        // @ts-ignore
                        logiciel?.libelle + " - " + logiciel?.version
                      }
                    </b>
                  </h6>
                  <p className="text-muted mb-1">
                    <b>Editeur:</b>{" "}
                    {
                      // @ts-ignore
                      logiciel?.editeur
                    }
                  </p>
                  <p className="text-muted mb-0">
                    <b>Date d'acquisition:</b>{" "}
                    {dayjs(
                      // @ts-ignore
                      logiciel?.dateAcquisition
                    ).format("YYYY-MM-DD")}
                  </p>
                  <p className="text-muted mb-0">
                    <b>Société:</b> {nomSociete || "N/A"}
                  </p>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="text-center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      // @ts-ignore
                      onClick={() => handleOpen(null)}
                    >
                      <InstallDesktopIcon />_ Ajouter Licence
                    </Button>
                  </Box>
                  <LicenceModal
                    openModal={openModal}
                    handleClose={handleClose}
                    isEditing={isEditing}
                    licenceData={licenceData}
                    handleChange={handleChange}
                    handleSave={handleSave}
                  />
                  <InstallLicenceModal
                    openInstallModal={openInstallModal}
                    handleClose={handleClose}
                    isEditing={isEditing}
                    installationData={licenceData}
                    handleChange={handleChangeInstall}
                    handleSave={handleSave}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col sm={6}>
                      <p className="mb-0">Liste des licences</p>
                    </Col>
                    <Col sm={12}>
                      <div style={{ height: 300, width: "100%" }}>
                        <DataGrid
                          rows={rowsLicences}
                          // @ts-ignore
                          columns={columnsLicences}
                          // @ts-ignore
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          disableSelectionOnClick
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default DetailsLogiciel;
