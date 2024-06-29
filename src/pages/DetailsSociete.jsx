import { Box, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ip } from "constants/ip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { DataGrid } from "@mui/x-data-grid";
import SocieteModal from "components/SocieteModal";

const DetailsSociete = () => {
  const { idSociete } = useParams();
  const [societe, setSociete] = useState({});
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [alimentations, setAlimentations] = useState([]);
  const [logiciels, setLogiciels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSociete = () => {
    axios
      .get(ip + `/societe/${idSociete}`)
      .then((response) => {
        setSociete(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur récupération société !!!", error);
      });
  };

  const fetchMateriels = () => {
    axios
      .get(ip + `/societe/${idSociete}/materiels`)
      .then((response) => {
        const formattedData = response.data.map((materiel, index) => ({
          id: materiel.numeroSerie || index + 1, // Ensure each item has a unique id
          ...materiel,
        }));
        setMateriels(formattedData);
      })
      .catch((error) => {
        console.error("Erreur récupération matériels!!!", error);
      });
  };

  const fetchAlimentations = () => {
    axios
      .get(ip + `/societe/${idSociete}/alimentations`)
      .then((response) => {
        const formattedData = response.data.map((alimentation, index) => ({
          id: alimentation.idAlimentation || index + 1, // Ensure each item has a unique id
          ...alimentation,
        }));
        setAlimentations(formattedData);
      })
      .catch((error) => {
        console.error("Erreur récupération alimentations!!!", error);
      });
  };

  // const fetchLogiciels = () => {
  //   axios
  //     .get(ip + `/logiciel`)
  //     .then((response) => {
  //       const formattedData = response.data.map((logiciel, index) => ({
  //         id: logiciel.idLogiciel || index + 1, // Ensure each item has a unique id
  //         ...logiciel,
  //       }));
  //       setLogiciels(formattedData);
  //     })
  //     .catch((error) => {
  //       console.error("Erreur récupération logiciels!!!", error);
  //     });
  // };

  useEffect(() => {
    fetchSociete();
    fetchMateriels();
    fetchAlimentations();
    // fetchLogiciels();
  }, []);

  // const columnsUtilisateurs = [
  //   { field: "idUtilisateur", headerName: "#ID", width: 100 },
  //   { field: "fullName", headerName: "Nom & Prénom", width: 200 },
  //   { field: "email", headerName: "Email", width: 200 },
  //   { field: "telephone", headerName: "Téléphone", width: 150 },
  // ];

  const columnsMateriels = [
    { field: "numeroSerie", headerName: "Numéro de Série", width: 150 },
    { field: "categorie", headerName: "Catégorie", width: 150 },
    { field: "marque", headerName: "Marque", width: 150 },
    { field: "modele", headerName: "Modèle", width: 150 },
    { field: "etatMateriel", headerName: "État", width: 150 },
    { field: "disponibilite", headerName: "Disponibilité", width: 150 },
  ];

  const columnsAlimentations = [
    { field: "idAlimentation", headerName: "#ID", width: 100 },
    { field: "refArt", headerName: "Reference", width: 150 },
    { field: "quantiteAlimente", headerName: "Quantité", width: 150 },
  ];

  const columnsLogiciels = [
    { field: "idLogiciel", headerName: "#ID", width: 100 },
    { field: "nom", headerName: "Nom", width: 200 },
    { field: "version", headerName: "Version", width: 150 },
  ];

  const [editItem, setEditItem] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    editItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    
  };

  const handleEditSociete = () => {
    setEditItem(societe);
    setModalOpen(true);
  };
  return (
    <div>
      <h1>Détails Société</h1>
      <section style={{ backgroundColor: "#eee" }}>
        <Container className="py-4">
          <Row>
            <Col>
              <Breadcrumb className="bg-body-tertiary rounded-3 p-3 mb-4">
                <Breadcrumb.Item href="/">Accueil</Breadcrumb.Item>
                <Breadcrumb.Item href="/societe">Sociétés</Breadcrumb.Item>
                <Breadcrumb.Item active aria-current="page">
                  Détails Société
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <Card className="mb-6">
                <Card.Body className="text-left">
                  <h6 className="my-1">
                    <b>Raison Sociale:</b> {societe.raisonSociale || "N/A"}
                  </h6>
                  <p className="text-muted mb-1">
                    <b>Adresse:</b> {societe.adresse || "N/A"}
                  </p>
                  <p className="text-muted mb-1">
                    <b>Email:</b> {societe.email || "N/A"}
                  </p>
                  <p className="text-muted mb-1">
                    <b>Téléphone:</b> {societe.numtel || "N/A"}
                  </p>
                  <p className="text-muted mb-1">
                    <b>Secteur d'Activité:</b>{" "}
                    {societe.secteurActivite || "N/A"}
                  </p>
                  <p className="text-muted mb-1">
                    <b>Type de Société:</b> {societe.typeSociete || "N/A"}
                  </p>
                  <p className="text-muted mb-1">
                    <b>Responsable:</b> {societe.responsable || "N/A"}
                  </p>
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
                    // Add functionality to handle edit button click
                    onClick={handleEditSociete}
                  >
                    <EditNoteIcon />
                    Modifier
                  </Button>
                </Box>
              </Card>
            </Col>
            <Col lg={8}>
              {/* <Card className="mb-4">
                  <Card.Body>
                    <Row>
                      <Col sm={6}>
                        <p className="mb-0">Utilisateurs Associés</p>
                      </Col>
                      <Col sm={12}>
                        <div style={{ height: 300, width: "100%" }}>
                          <DataGrid
                            rows={utilisateurs}
                            columns={columnsUtilisateurs}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card> */}
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col sm={6}>
                      <p className="mb-0">Matériels Associés</p>
                    </Col>
                    <Col sm={12}>
                      <div style={{ height: 300, width: "100%" }}>
                        <DataGrid
                          rows={materiels}
                          columns={columnsMateriels}
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
                      <p className="mb-0">Alimentations Associées</p>
                    </Col>
                    <Col sm={12}>
                      <div style={{ height: 300, width: "100%" }}>
                        <DataGrid
                          rows={alimentations}
                          columns={columnsAlimentations}
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
                      <p className="mb-0">Logiciels Associés</p>
                    </Col>
                    <Col sm={12}>
                      <div style={{ height: 300, width: "100%" }}>
                        <DataGrid
                          rows={logiciels}
                          columns={columnsLogiciels}
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
        <SocieteModal
          open={modalOpen}
          handleClose={handleModalClose}
          isEditing={true}
          editItem={editItem}
          handleChange={handleChange}         
        />
      </section>
    </div>
  );
};

export default DetailsSociete;
