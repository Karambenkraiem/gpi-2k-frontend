import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const DetailsMateriel = () => {
  const { numeroSerie } = useParams();
  const [materiel, setMateriel] = useState({});
  const [affectations, setAffectations] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [societies, setSocieties] = useState([]);

  const fetchAffectations = () => {
    axios
      .get(`http://localhost:3000/affectation/${numeroSerie}`)
      .then((response) => {
        setAffectations(response.data);
      })
      .catch((error) => {
        console.error("Erreur récupération des affectations!", error);
      });
  };

  const fetchEmprunts = () => {
    axios
      .get(`http://localhost:3000/emprunt/${numeroSerie}`)
      .then((response) => {
        setEmprunts(response.data);
      })
      .catch((error) => {
        console.error("Erreur récupération des emprunts!", error);
      });
  };

  const fetchMateriel = () => {
    axios
      .get(`http://localhost:3000/materiel/${numeroSerie}`)
      .then((response) => {
        setMateriel(response.data);
      })
      .catch((error) => {
        console.error("Erreur recupération matériels !!!", error);
      });
  };

  const fetchSocieties = () => {
    axios
      .get(`http://localhost:3000/societe`)
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
  }, [numeroSerie]);

  const rowsAffectations = affectations.map((affectation, index) => ({
    id: index,
    ...affectation,
    fullName: affectation.utilisateur?.fullName || "N/A",
    numeroSerie: affectation.materiel?.numeroSerie || "N/A",
    categorie: affectation.materiel?.categorie || "N/A",
    marque: affectation.materiel?.marque || "N/A",
  }));

  const columnsAffectations = [
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
  }));

  const columnsEmprunts = [
    { field: "idUtilisateur", headerName: "Matricule", width: 100 },
    { field: "fullName", headerName: "Nom & Prénom", width: 200 },
    { field: "dateEmprunt", headerName: "Date Emprunt", width: 150 },
    { field: "dateRestitution", headerName: "Date Restitution", width: 150 },
    { field: "refProjet", headerName: "Référence Projet", width: 150 },
    {field: "etatMatRestitution", headerName: "État Matériel Restitution", width: 220 },
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
    (society) => society.idSociete === materiel.idSociete
  )?.raisonSociale;

  return (
    <div>
      <h1>Details matériel</h1>
      <section style={{ backgroundColor: "#eee" }}>
        <Container className="py-4">
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
                    <b>{materiel?.categorie}</b>
                  </h6>
                  <h6 className="my-1">
                    <b>{materiel?.marque + " " + materiel?.modele}</b>
                  </h6>
                  <h6 className="my-3">
                    <b>Numéro de série:</b> {materiel?.numeroSerie}
                  </h6>
                  <p className="text-muted mb-1">
                    <b>Prix:</b> {materiel?.prix + " Dinars"}
                  </p>
                  <p className="text-muted mb-1">
                    <b>Garantie:</b> {materiel?.garantie + " an(s)"}
                  </p>
                  <p className="text-muted mb-1">
                    <b>État: </b> {materiel?.etatMateriel}
                  </p>
                  <p className="text-muted mb-0">
                    <b>Date d'acquisition:</b>{" "}
                    {formatDate(materiel?.dateAcquisition)}
                  </p>
                  <p className="text-muted mb-0">
                    <b>Société:</b> {nomSociete || "N/A"}
                  </p>
                  {(materiel?.categorie === "UniteCentrale" ||
                    materiel?.categorie === "PcPortable" ||
                    materiel?.categorie === "Serveur" ) && (
                    <>
                      <p className="text-muted mb-0">
                        <b>Processeur:</b> {materiel?.processeurPC}
                      </p>
                      <p className="text-muted mb-0">
                        <b>Mémoire cache:</b> {materiel?.memoireCache}
                      </p>
                      <p className="text-muted mb-0">
                        <b>RAM:</b> {materiel?.ram}
                      </p>
                      <p className="text-muted mb-0">
                        <b>Disque dur:</b> {materiel?.disque}
                      </p>
                      <p className="text-muted mb-0">
                        <b>Nombre de disques:</b> {materiel?.nombreDisque}
                      </p>
                      <p className="text-muted mb-0">
                        <b>Carte Graphique:</b> {materiel?.carteGraphique}
                      </p>
                      
                    </>
                  )}
                  {materiel?.categorie === "Ecran" && (
                    <p className="text-muted mb-0">
                      <b>Taille Écran:</b> {materiel?.tailleEcran + '"'}
                    </p>
                  )}
                  {materiel?.categorie === "PcPortable" && (
                    <>
                    <p className="text-muted mb-0">
                      <b>Taille de l'écran:</b> {materiel?.tailleEcran}
                    </p>
                    <p className="text-muted mb-0">
                      <b>Etat de batterie:</b> {materiel?.etatBatteriePcPortable}
                    </p>
                    </>
                  )}
                  {materiel?.categorie === "Imprimante" && (
                    <>
                    <p className="text-muted mb-0">
                      <b>Vitesse d'impression:</b> {materiel?.vitesseImpression}
                    </p>
                    <p className="text-muted mb-0">
                      <b>Technologie d'impression:</b> {materiel?.technologieImpression}
                    </p>
                    </>
                  )}
                  {materiel?.categorie === "Scanner" && (
                    <>
                    <p className="text-muted mb-0">
                      <b>Vitesse de scan:</b> {materiel?.vitesseScanner}
                    </p>
                    <p className="text-muted mb-0">
                      <b>Type de Scanner:</b> {materiel?.typeScanner}
                    </p>
                    </>
                  )}
                  {(materiel?.categorie === "Imprimante" ||
                    materiel?.categorie === "Scanner") && (
                    <>
                      <p className="text-muted mb-0">
                        <b>Type de Connexion:</b> {materiel?.connexionWLU}
                      </p>
                      <p className="text-muted mb-0">
                        <b>Résolution:</b> {materiel?.resolutionScanImpVideoP}
                      </p>
                      <p className="text-muted mb-0">
                        <b>Format:</b> {materiel?.formatScanImp}
                      </p>
                      <p className="text-muted mb-0">
                        <b>Fonctions Supplémentaires:</b> {materiel?.fonctionSupplementaireScanImp}
                      </p>
                    </>
                  )}
                  {materiel?.categorie === "Onduleur" && (
                    <>
                    <p className="text-muted mb-0">
                      <b>Poids Onduleur:</b> {materiel?.poidsOnduleur}
                    </p>
                    <p className="text-muted mb-0">
                      <b>Autonomie Onduleur:</b> {materiel?.autonomieOnduleur}
                    </p>
                    <p className="text-muted mb-0">
                      <b>Capacité Onduleur:</b> {materiel?.capaciteChargeOnduleur}
                    </p>
                    <p className="text-muted mb-0">
                      <b>Technologie Onduleur:</b> {materiel?.technologieOnduleur}
                    </p>
                    </>
                  )}
                  {materiel?.categorie === "Switch" && (
                    <>
                    <p className="text-muted mb-0">
                      <b>Nombre de Ports:</b> {materiel?.nombrePortSwitch}
                    </p>
                    <p className="text-muted mb-0">
                      <b>Débit:</b> {materiel?.debitSwitch}
                    </p>
                    <p className="text-muted mb-0">
                      <b>Technologie Switch:</b> {materiel?.technologieSwitch}
                    </p>
                    </>
                  )}
                  
                </Card.Body>
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
                          columns={columnsAffectations}
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
                          columns={columnsEmprunts}
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

export default DetailsMateriel;
