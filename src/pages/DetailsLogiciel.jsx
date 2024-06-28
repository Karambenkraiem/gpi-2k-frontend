import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { ip } from "constants/ip";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import RestorePageIcon from "@mui/icons-material/RestorePage";

const DetailsLogiciel = () => {
  const { idLogiciel } = useParams();
  const [societies, setSocieties] = useState([]);
  const [logiciels, setLogiciels] = useState([]);
  const [logiciel, setLogiciel] = useState([]);
  const [licences, setLicences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [licenceData, setLicenceData] = useState({
    idLicence: "",
    numeroLicence: "",
    dateActivation: "",
    dateExpiration: "",
    prixLicence: null,
    idLogiciel: "",
    statut: "",
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

  const handleOpenModal = (licence = null) => {
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
        idLogiciel: "",
        statut: "",
      });
      setIsEditing(false);
    }
    setOpenModal(true);
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
          <Button title="Modifier licence" onClick={null}>
            <EditNoteIcon />
          </Button>
          <Button
            title="Assigner une licence"
            disabled={
              params.row.disponibilite === "Affecté" ||
              params.row.disponibilite === "Emprunté"
            }
            onClick={null}
          >
            <InstallDesktopIcon />
          </Button>
          <Button
            title="Retirer une licence"
            disabled={
              params.row.disponibilite === "Affecté" ||
              params.row.disponibilite === "Emprunté"
            }
            onClick={null}
          >
            <RestorePageIcon />
          </Button>
        </div>
      ),
    },

    { field: "idLicence", headerName: "#ID", width: 50 },
    { field: "numeroLicence", headerName: "N° Licence", width: 200 },
    { field: "statut", headerName: "Statut", width: 100 },
    { field: "dateActivation", headerName: "Date Activation", width: 150 },
    { field: "dateExpiration", headerName: "Date expiration", width: 150 },
  ];

  return (
    <div>
      <h1>Details logiciels</h1>
      <section style={{ backgroundColor: "#eee" }}>
        <Container className="py-4">
          <Row>
            <Col>
              <Breadcrumb className="bg-body-tertiary rounded-3 p-3 mb-4">
                <Breadcrumb.Item href="/">Accueil</Breadcrumb.Item>
                <Breadcrumb.Item href="/logiciels">Logiciels</Breadcrumb.Item>
                <Breadcrumb.Item active aria-current="page">
                  Détails logiciel
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
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
                      onClick={handleOpenModal}
                    >
                      <InstallDesktopIcon />_ Ajouter Licence
                    </Button>
                  </Box>
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
