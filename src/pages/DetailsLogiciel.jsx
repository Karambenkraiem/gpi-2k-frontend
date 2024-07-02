import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Card, Col, Container, Row } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { ip } from "constants/ip";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import LicenceModal from "components/LicenceModal";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import InstallLicenceModal from "components/InstallLicenceModal";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";

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
    idInstallation: "",
    idLicence: "",
    numeroLicence: "",
    dateActivation: "",
    dateExpiration: "",
    prixLicence: null,
    idLogiciel: idLogiciel,
  });

  const [installationData, setInstallationData] = useState({
    idInstallation: "",
    numeroLicence: "",
    idLicence: "",
    numeroSerie: "",
    dateInstallation: "",
    dateDesinstallation: "",
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

  const handleInstallationsEnCours = () => {
    navigate(`/installations/encours`);
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
  }, []);

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
        idInstallation: "",
        idLicence: "",
        numeroLicence: "",
        dateActivation: "",
        dateExpiration: "",
        prixLicence: null,
        idLogiciel: idLogiciel,
      });
      console.log(idLogiciel);
      setIsEditing(false);
    }
    setOpenModal(true);
  };

  const handleInstallOpen = (rowData = null, idLic, NumLic) => {
    if (rowData) {
      setInstallationData(rowData);
      setIsEditing(true);
    } else {
      setInstallationData({
        idInstallation: "",
        numeroLicence: NumLic,
        idLicence: idLic,
        numeroSerie: "",
        dateInstallation: "",
        dateDesinstallation: "",
      });
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
          statutLicence: "Disponible",
          idLogiciel: parseInt(licenceData.idLogiciel),
        })
        .then((response) => {
          setLicences([...licences, response.data]);
          fetchLicences();
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout de la licence!");
        });
    }
  };

  const handleSaveInstallation = () => {
    const { idInstallation, idLicence, numeroSerie, dateInstallation, dateDesinstallation } = installationData;
  
    const fetchUpdatedLicenses = () => {
      axios.get(`${ip}/licence`)
        .then((response) => {
          // Assuming you have a method to update the state of licenses in your component
          setLicenceData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching updated licenses", error);
        });
    };
  
    if (isEditing) {
      Promise.all([
        axios.patch(`${ip}/installation/${parseInt(idInstallation)}`, {
          idLicence,
          numeroSerie,
          dateInstallation,
          dateDesinstallation,
          etatOperation: "Désinstallée",
        }),
        axios.patch(`${ip}/licence/${parseInt(idLicence)}`, {
          statutLicence: "Disponible",
        }),
      ])
        .then(([response1, response2]) => {
          console.log("Installation and license updated successfully", response1, response2);
          fetchUpdatedLicenses();
          handleClose();
        })
        .catch((error) => {
          console.error("Error updating installation or license", error);
        });
    } else {
      Promise.all([
        axios.post(`${ip}/installation`, {
          idLicence,
          numeroSerie,
          dateInstallation,
          dateDesinstallation: null,
          etatOperation: "En cours d'utilisation",
        }),
        axios.patch(`${ip}/licence/${parseInt(idLicence)}`, {
          statutLicence: "Assignée",
        }),
      ])
        .then(([response1, response2]) => {
          console.log("Installation created and license updated successfully", response1, response2);
          fetchUpdatedLicenses();
          handleClose();
        })
        .catch((error) => {
          console.error("Error creating installation or updating license", error);
        });
    }
  };
  
  

  // const handleSaveInstallation = () => {
  //   if (isEditing) {
  //     Promise.all([
  //       axios.patch(
  //         `${ip}/installation/${parseInt(installationData.idInstallation)}`,
  //         {
  //           idLicence: installationData.idLicence,
  //           numeroSerie: installationData.numeroSerie,
  //           dateInstallation: installationData.dateInstallation,
  //           dateDesinstallation: installationData.dateDesinstallation,
  //           etatOperation: "Désinstallée",
  //         }
  //       ),
  //       axios.patch(`${ip}/licence/${parseInt(installationData.idLicence)}`, {
  //         statutLicence: "Disponible",
  //       }),
  //     ])
  //       .then((response1, response2) => {
  //         handleClose();
  //       })
  //       .catch((error) =>
  //         console.error("Probleme modification de la licence", error)
  //       );
  //   } else {
  //     Promise.all([
  //       axios.post(`${ip}/installation`, {
  //         idLicence: installationData.idLicence,
  //         numeroSerie: installationData.numeroSerie,
  //         dateInstallation: installationData.dateInstallation,
  //         dateDesinstallation: null,
  //         etatOperation: "En cours d'utilisation",
  //       }),
  //       axios.patch(`${ip}/licence/${parseInt(installationData.idLicence)}`, {
  //         statutLicence: "Assignée  ",
  //       }),
  //     ])
  //       .then((response1, response2) => {
  //         handleClose();
  //       })
  //       .catch((error) => {
  //         console.error("Erreur ajout de la licence!");
  //       });
  //   }
  // };

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
      width: 150,
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
            disabled={params.row.statutLicence === "Assignée"}
            onClick={() =>
              handleInstallOpen(
                null,
                params.row.idLicence,
                params.row.numeroLicence
              )
            }
          >
            <InstallDesktopIcon />
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              color="primary" // Use primary color
              //style={{ marginBottom: 16 }}
              startIcon={<ReplyAllIcon />}
            >
              RETOUR
            </Button>
            <Box display="flex" gap={2}>
              <Button
                // variant="contained"
                color="primary"
                startIcon={<ManageHistoryOutlinedIcon />}
                onClick={handleInstallationsEnCours}
              >
                Désinstallation des licences
              </Button>
            </Box>
          </Box>

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
                      startIcon={<InstallDesktopIcon />}
                    >
                      Ajouter Licence
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
                    installationData={installationData}
                    handleChange={handleChangeInstall}
                    handleSave={handleSaveInstallation}
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
