import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AffectationModal from "../components/AffectationModal";
// @ts-ignore
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ip } from "constants/ip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EmpruntModal from "components/EmpruntModal";
import QueuePlayNextOutlinedIcon from "@mui/icons-material/QueuePlayNextOutlined";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";


const DetailsMateriel = () => {
  const { numeroSerie } = useParams();
  const [materiel, setMateriel] = useState({});
  const [affectations, setAffectations] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [errors, setErrors] = useState({});
  const [openAffectation, setOpenAffectation] = useState(false);
  const [openEmprunt, setOpenEmprunt] = useState(false);
  const navigate = useNavigate();
  // @ts-ignore
  const [materiels, setMateriels] = useState([]);
  // @ts-ignore
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // @ts-ignore
  const handleClose = () => setOpenAffectation(false);

  const [affectationData, setAffectationData] = useState({
    idUtilisateur: "",
    numeroSerie: "",
    dateAttribution: "",
    dateRetour: null,
    motifRetour: null,
  });

  const [empruntData, setEmpruntData] = useState({
    idUtilisateur: "",
    numeroSerie: "",
    dateEmprunt: "",
    dateRestitution: null,
    refProjet: "",
    etatMatRestitution: null,
  });

  const handleBtnAffecterClick = (numeroSerie) => {
    console.log(numeroSerie);
    setAffectationData({ ...affectationData, numeroSerie });
    setOpenAffectation(true);
  };

  const handleChangeAffectation = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setAffectationData({
      ...affectationData,
      [name]: value,
    });
    validateMateriel(name, value);
  };

  const handleChangeEmprunt = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setEmpruntData({
      ...empruntData,
      [name]: value,
    });
    validateMateriel(name, value);
  };

  const fetchMateriels = () => {
    axios
      .get(ip + "/materiel")
      .then((response) => {
        setMateriels(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // @ts-ignore
  const handleAffectation = (idAffectation) => {
    // @ts-ignore
    setAffectationData({ ...affectationData, idAffectation });
    setOpenAffectation(true);
  };

  const handleAffectationEdit = (row) => {
    setAffectationData(row);
    setIsEditing(true);
    setOpenAffectation(true);
  };

  const handleEmpruntEdit = (row) => {
    setEmpruntData(row);
    setIsEditing(true);
    setOpenEmprunt(true);
  };

  const handleSaveAffectation = () => {
    const affectationToSave = {
      ...affectationData,
      // @ts-ignore
      idAffectation: parseInt(affectationData.idAffectation, 10),
      numeroSerie: affectationData.numeroSerie,
    };

    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
    if (hasErrors) {
      console.error("Veuillez remplir tous les champs obligatoires!");
      return;
    }
    if (isEditing) {
      Promise.all([
        axios.patch(
          `${ip}/affectation/${affectationToSave.idAffectation}`,
          affectationData
        ),
        axios.patch(`${ip}/materiel/${affectationToSave.numeroSerie}`, {
          // @ts-ignore
          disponibilite: affectationData.disponibilite,
        }),
      ])
        // @ts-ignore
        .then(([response1, response2]) => {
          fetchMateriels();
          setOpenAffectation(false);
        })
        .catch((error) => {
          console.error("Erreur Affectation", error);
        });
    } else {
      Promise.all([
        axios.post(ip + "/affectation/", affectationData),
        axios.patch(`${ip}/materiel/${affectationData.numeroSerie}`, {
          // @ts-ignore
          disponibilite: affectationData.disponibilite,
        }),
      ])
        // @ts-ignore
        .then((response) => {
          fetchMateriels();
          setOpenAffectation(false);
        })
        .catch((error) => console.error("Erreur emprunt!", error));
    }
  };

 
  const handleSaveEmprunt = () => {

    // @ts-ignore
    const empruntToSave = {
      ...empruntData,
      // @ts-ignore
      idEmprunt: parseInt(empruntData.idEmprunt, 10),
      numeroSerie: empruntData.numeroSerie,
    };

    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
    if (hasErrors) {
      console.error("Veuillez remplir tous les champs obligatoires!");
      return;
    }
    if (isEditing){
    Promise.all([
      axios.patch(
        // @ts-ignore
        `${ip}/affectation/${empruntData.idEmprunt}`,
        empruntData
      ),
      axios.patch(`${ip}/materiel/${empruntData.numeroSerie}`, {
        // @ts-ignore
        disponibilite: empruntData.disponibilite,
      }),
    ])
      // @ts-ignore
      .then(([response1, response2]) => {
        fetchMateriels();
        setOpenEmprunt(false);
      })
      .catch((error) => {
        console.error("Erreur Emprunt", error);
      });
    } else {
      Promise.all([
        axios.post(ip + "/emprunt", empruntData),
        axios.patch(`${ip}/materiel/${empruntData.numeroSerie}`, {
          // @ts-ignore
          disponibilite: empruntData.disponibilite,
        }),
      ])
        // @ts-ignore
        .then((response) => {
          fetchMateriels();
          setOpenEmprunt(false);
        })
        .catch((error) => console.error("Erreur emprunt!", error));
    }
  };

  const validateMateriel = (name, value) => {
    let errorMsg = "";

    if (name === "numeroSerie" && !value) {
      errorMsg = "Numéro de Série est obligatoire !!!";
    } else if (name === "categorie" && !value) {
      errorMsg = "Catégorie est obligatoire";
    } else if (name === "marque" && !value) {
      errorMsg = "Marque est obligatoire";
    } else if (name === "modele" && !value) {
      errorMsg = "Modèle est obligatoire";
    } else if (name === "prix" && (!value || isNaN(value) || value <= 0)) {
      errorMsg = "Prix doit être un nombre positif";
    } else if (name === "garantie" && !value) {
      errorMsg = "Garantie est obligatoire";
    } else if (name === "etatMateriel" && !value) {
      errorMsg = "État Matériel est obligatoire";
    } else if (name === "dateAcquisition" && !value) {
      errorMsg = "Date d'Acquisition est obligatoire";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const fetchAffectations = () => {
    axios
      .get(ip + `/affectation/${numeroSerie}`)
      .then((response) => {
        setAffectations(response.data);
      })
      .catch((error) => {
        console.error("Erreur récupération de la liste des installations!", error);
      });
  };

  const fetchEmprunts = () => {
    axios
      .get(ip + `/emprunt/${numeroSerie}`)
      .then((response) => {
        setEmprunts(response.data);
      })
      .catch((error) => {
        console.error("Erreur récupération des emprunts!", error);
      });
  };

  const fetchMateriel = () => {
    axios
      .get(ip + `/materiel/${numeroSerie}`)
      .then((response) => {
        setMateriel(response.data);
      })
      .catch((error) => {
        console.error("Erreur recupération matériels !!!", error);
      });
  };

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

  useEffect(() => {
    fetchMateriel();
    fetchAffectations();
    fetchEmprunts();
    fetchSocieties();
  });

  const rowsAffectations = affectations.map((affectation, index) => ({
    id: index,
    ...affectation,
    fullName: affectation.Utilisateur?.fullName || "N/A",
    numeroSerie: affectation.Materiel?.numeroSerie || "N/A",
    categorie: affectation.Materiel?.categorie || "N/A",
    marque: affectation.Materiel?.marque || "N/A",
    disponibilite: affectation.Materiel?.disponibilite || "N/A",
  }));

  const columnsAffectations = [
    {
      field: "actions",
      headerName: "Modification",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => (
        <div text-align="letf">
          <Button
            title="Affecter matériel"
            disabled={params.row.statut === "Affecté"}
            onClick={() => handleAffectationEdit(params.row)}
          >
            <EditNoteIcon />
          </Button>
        </div>
      ),
    },
    { field: "idAffectation", headerName: "#ID", width: 100 },
    { field: "idUtilisateur", headerName: "Matricule", width: 100 },
    { field: "fullName", headerName: "Nom & Prénom", width: 200 },
    { field: "dateAttribution", headerName: "Date Attribution", width: 150 },
    { field: "dateRetour", headerName: "Date Retour", width: 150 },
    { field: "motifRetour", headerName: "Motif Retour", width: 220 },
  ];

  const rowsEmprunts = emprunts.map((emprunt, index) => ({
    id: index,
    ...emprunt,
    fullName: emprunt.utilisateur?.fullName || "N/A",
    numeroSerie: emprunt.materiel?.numeroSerie || "N/A",
    categorie: emprunt.materiel?.categorie || "N/A",
    marque: emprunt.materiel?.marque || "N/A",
    disponibilite: emprunt.Materiel?.disponibilite || "N/A",
  }));

  const columnsEmprunts = [
    {
      field: "actions",
      headerName: "Modification",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => (
        <div text-align="letf">
          <Button
            title="Emprunter matériel"
            onClick={() => handleEmpruntEdit(params.row)}
          >
            <EditNoteIcon />
          </Button>
        </div>
      ),
    },
    { field: "idEmprunt", headerName: "#ID", width: 100 },
    { field: "idUtilisateur", headerName: "Matricule", width: 100 },
    { field: "fullName", headerName: "Nom & Prénom", width: 200 },
    { field: "dateEmprunt", headerName: "Date Emprunt", width: 150 },
    { field: "dateRestitution", headerName: "Date Restitution", width: 150 },
    { field: "refProjet", headerName: "Référence Projet", width: 150 },
    {
      field: "etatMatRestitution",
      headerName: "État Matériel Restitution",
      width: 220,
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const nomSociete = societies.find(
    // @ts-ignore
    (society) => society.idSociete === materiel.idSociete
  )?.raisonSociale;

  return (
    <div>
      <h1>Details matériel</h1>
      <section style={{ backgroundColor: "#eee" }}>
        <Container className="py-4">
        <Button
            onClick={() => navigate(-1)}
            variant="contained"
            color="primary" // Use primary color
            style={{
              marginBottom: 16,
              backgroundColor: "#3B71CA",
              color: "white",
            }}
          >
            <ReplyAllIcon /> Back
          </Button>
          <Row>
            <Col>
              <Breadcrumb className="bg-body-tertiary rounded-3 p-3 mb-4">
                <Breadcrumb.Item href="/">Accueil</Breadcrumb.Item>
                <Breadcrumb.Item href="/materiel">Matériel</Breadcrumb.Item>
                <Breadcrumb.Item active aria-current="page">
                  Détails Matériel
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <Card className="mb-6">
                <Card.Body className="text-left">
                  <h6 className="my-1">
                    <b>
                      {
                        // @ts-ignore
                        materiel?.categorie
                      }
                    </b>
                  </h6>
                  <h6 className="my-1">
                    <b>
                      {
                        // @ts-ignore
                        materiel?.marque + " " + materiel?.modele
                      }
                    </b>
                  </h6>
                  <h6 className="my-3">
                    <b>Numéro de série:</b>{" "}
                    {
                      // @ts-ignore
                      materiel?.numeroSerie
                    }
                  </h6>
                  <p className="text-muted mb-1">
                    <b>Prix:</b>{" "}
                    {
                      // @ts-ignore
                      materiel?.prix + " Dinars"
                    }
                  </p>
                  <p className="text-muted mb-1">
                    <b>Garantie:</b>{" "}
                    {
                      // @ts-ignore
                      materiel?.garantie + " an(s)"
                    }
                  </p>
                  <p className="text-muted mb-1">
                    <b>État: </b>{" "}
                    {
                      // @ts-ignore
                      materiel?.etatMateriel
                    }
                  </p>
                  <p className="text-muted mb-0">
                    <b>Date d'acquisition:</b>{" "}
                    {formatDate(
                      // @ts-ignore
                      materiel?.dateAcquisition
                    )}
                  </p>
                  <p className="text-muted mb-0">
                    <b>Société:</b> {nomSociete || "N/A"}
                  </p>
                  {
                    // @ts-ignore
                    (materiel?.categorie === "UniteCentrale" ||
                      // @ts-ignore
                      materiel?.categorie === "PcPortable" ||
                      // @ts-ignore
                      materiel?.categorie === "Serveur") && (
                      <>
                        <p className="text-muted mb-0">
                          <b>Processeur:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.processeurPC
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Mémoire cache:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.memoireCache
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>RAM:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.ram
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Disque dur:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.disque
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Nombre de disques:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.nombreDisque
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Carte Graphique:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.carteGraphique
                          }
                        </p>
                      </>
                    )
                  }
                  {
                    // @ts-ignore
                    materiel?.categorie === "Ecran" && (
                      <p className="text-muted mb-0">
                        <b>Taille Écran:</b>{" "}
                        {
                          // @ts-ignore
                          materiel?.tailleEcran + '"'
                        }
                      </p>
                    )
                  }
                  {
                    // @ts-ignore
                    materiel?.categorie === "PcPortable" && (
                      <>
                        <p className="text-muted mb-0">
                          <b>Taille de l'écran:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.tailleEcran
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Etat de batterie:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.etatBatteriePcPortable
                          }
                        </p>
                      </>
                    )
                  }
                  {
                    // @ts-ignore
                    materiel?.categorie === "Imprimante" && (
                      <>
                        <p className="text-muted mb-0">
                          <b>Vitesse d'impression:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.vitesseImpression
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Technologie d'impression:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.technologieImpression
                          }
                        </p>
                      </>
                    )
                  }
                  {
                    // @ts-ignore
                    materiel?.categorie === "Scanner" && (
                      <>
                        <p className="text-muted mb-0">
                          <b>Vitesse de scan:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.vitesseScanner
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Type de Scanner:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.typeScanner
                          }
                        </p>
                      </>
                    )
                  }
                  {
                    // @ts-ignore
                    (materiel?.categorie === "Imprimante" ||
                      // @ts-ignore
                      materiel?.categorie === "Scanner") && (
                      <>
                        <p className="text-muted mb-0">
                          <b>Type de Connexion:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.connexionWLU
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Résolution:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.resolutionScanImpVideoP
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Format:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.formatScanImp
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Fonctions Supplémentaires:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.fonctionSupplementaireScanImp
                          }
                        </p>
                      </>
                    )
                  }
                  {
                    // @ts-ignore
                    materiel?.categorie === "Onduleur" && (
                      <>
                        <p className="text-muted mb-0">
                          <b>Poids Onduleur:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.poidsOnduleur
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Autonomie Onduleur:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.autonomieOnduleur
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Capacité Onduleur:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.capaciteChargeOnduleur
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Technologie Onduleur:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.technologieOnduleur
                          }
                        </p>
                      </>
                    )
                  }
                  {
                    // @ts-ignore
                    materiel?.categorie === "Switch" && (
                      <>
                        <p className="text-muted mb-0">
                          <b>Nombre de Ports:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.nombrePortSwitch
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Débit:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.debitSwitch
                          }
                        </p>
                        <p className="text-muted mb-0">
                          <b>Technologie Switch:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.technologieSwitch
                          }
                        </p>
                      </>
                    )
                  }
                  {
                    // @ts-ignore
                    materiel?.categorie === "VideoProjecteur" && (
                      <>
                        <p className="text-muted mb-0">
                          <b>Résolution:</b>{" "}
                          {
                            // @ts-ignore
                            materiel?.resolutionScanImpVideoP
                          }
                        </p>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  // @ts-ignore
                                  materiel?.entreeHDMI_VideoProjecteur
                                }
                              />
                            }
                            label="HDMI"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  // @ts-ignore
                                  materiel?.entreeVGA_VideoProjecteur
                                }
                              />
                            }
                            label="VGA"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  // @ts-ignore
                                  materiel?.entreeUSB_VideoProjecteur
                                }
                              />
                            }
                            label="USB"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  // @ts-ignore
                                  materiel?.entreeLAN_VideoProjecteur
                                }
                              />
                            }
                            label="LAN"
                          />
                        </FormGroup>
                      </>
                    )
                  }
                </Card.Body>
              </Card>
              <Card>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                  mt={2}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ flexGrow: 1 }}
                    // @ts-ignore
                    onClick={() => {handleBtnAffecterClick(materiel?.numeroSerie)}
                    }
                  >
                    <QueuePlayNextOutlinedIcon />
                    _Affecter
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    <ManageHistoryOutlinedIcon />
                    _Emprunter
                  </Button>
                </Box>
              </Card>
            </Col>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col sm={6}>
                      <p className="mb-0">Historique des affectations</p>
                    </Col>
                    <Col sm={12}>
                      <div style={{ height: 300, width: "100%" }}>
                        <DataGrid
                          rows={rowsAffectations}
                          // @ts-ignore
                          columns={columnsAffectations}
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
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col sm={6}>
                      <p className="mb-0">Historique des emprunts</p>
                    </Col>
                    <Col sm={12}>
                      <div style={{ height: 300, width: "100%" }}>
                        <DataGrid
                          rows={rowsEmprunts}
                          // @ts-ignore
                          columns={columnsEmprunts}
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
          <AffectationModal
            openAffectation={openAffectation}
            affectationData={affectationData}
            isEditing={isEditing}
            handleClose={() => setOpenAffectation(false)}
            handleChange={handleChangeAffectation}
            handleSave={handleSaveAffectation}
            errors={errors}
          />

          <EmpruntModal
            openEmprunt={openEmprunt}
            empruntData={empruntData}
            formData={FormData}
            isEditing={isEditing}
            handleClose={() => setOpenEmprunt(false)}
            handleChange={handleChangeEmprunt}
            handleSave={handleSaveEmprunt}
            errors={errors}
          />
        </Container>
      </section>
    </div>
  );
};

export default DetailsMateriel;
