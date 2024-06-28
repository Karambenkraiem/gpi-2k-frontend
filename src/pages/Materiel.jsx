import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
} from "@mui/material";
import QueuePlayNextOutlinedIcon from "@mui/icons-material/QueuePlayNextOutlined";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import axios from "axios";
import { ip } from "constants/ip";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import AffectationModal from "components/AffectationModal";
import EmpruntModal from "components/EmpruntModal";

const MaterielPage = () => {
  const [materiels, setMateriels] = useState([]);
  const [open, setOpen] = useState(false);

  const [affectationData, setAffectationData] = useState({
    idUtilisateur:"",
    numeroSerie: "",
    dateAttribution: "",
    dateRetour: null,
    motifRetour: null,
  });

  const [empruntData, setEmpruntData] = useState({
    dateEmprunt: "",
    dateRestitution: null,
    refProjet: "",
    etatMatRestitution: null,
  });

  const [openAffectation, setOpenAffectation] = useState(false);
  const [openEmprunt, setOpenEmprunt] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [societies, setSocieties] = useState([]);
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const Categorie = {
    UniteCentrale: "UniteCentrale",
    Ecran: "Ecran",
    PcPortable: "PcPortable",
    Imprimante: "Imprimante",
    Scanner: "Scanner",
    Onduleur: "Onduleur",
    VideoProjecteur: "VideoProjecteur",
    Serveur: "Serveur",
    Switch: "Switch",
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
  };
  const EtatMateriel = {
    nouveau: "nouveau",
    fonctionnel: "fonctionnel",
    enPanne: "enPanne",
    rebut: "rebut",
  };
  const ConnexionWLU = {
    WIFI: "WIFI",
    LAN: "LAN",
    USB: "USB",
  };
  const TechnologieOnduleur = {
    off_line: "off_line",
    on_line: "on_line",
    in_line: "in_line",
  };
  const TypeScanner = {
    Aplat: "Aplat",
    ChargeAutomatique: "ChargeAutomatique",
  };
  const TechnologieImpression = {
    inkTank: "inkTank",
    ecoTank: "ecoTank",
    Laser: "Laser",
    JetEncre: "JetEncre",
  };

  const [state, setState] = useState({
    // @ts-ignore
    entreeHDMI_VideoProjecteur: false,
    entreeVGA_VideoProjecteur: false,
    entreeUSB_VideoProjecteur: false,
    entreeLAN_VideoProjecteur: false,
  });

  const [formData, setFormData] = useState({
    numeroSerie: "",
    categorie: "",
    marque: "",
    modele: "",
    prix: "",
    garantie: "",
    etatMateriel: "",
    dateAcquisition: "",
    disponibilite:"",
    idSociete: "",
    nombrePortSwitch: "",
    debitSwitch: "",
    technologieSwitch: "",
    processeurPC: "",
    memoireCache: "",
    ram: "",
    disque: "",
    carteGraphique: "",
    nombreDisque: "",
    tailleEcran: "",
    etatBatteriePcPortable: "",
    vitesseImpression: "",
    connexionWLU: ConnexionWLU.null,
    technologieOnduleur: TechnologieOnduleur.null,
    fonctionSupplementaireScanImp: "",
    vitesseScanner: "",
    typeScanner: TypeScanner.null,
    resolutionScanImpVideoP: "",
    technologieImpression: TechnologieImpression.null,
    formatScanImp: "",
    poidsOnduleur: "",
    autonomieOnduleur: "",
    capaciteChargeOnduleur: "",
    entreeHDMI_VideoProjecteur: state.entreeHDMI_VideoProjecteur,
    entreeVGA_VideoProjecteur: state.entreeVGA_VideoProjecteur,
    entreeUSB_VideoProjecteur: state.entreeUSB_VideoProjecteur,
    entreeLAN_VideoProjecteur: state.entreeLAN_VideoProjecteur,
  });

  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: true,
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: true,
    }));
  };

  useEffect(() => {
    fetchMateriels();
  }, []);

  const fetchMateriels = () => {
    axios
      .get(`${ip}/materiel`)
      .then((response) => {
        const processedData = response.data.map((materiel) => {
          return {
            ...materiel,
          };
        });
        setMateriels(processedData);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    // @ts-ignore
    setFormData({});
    setIsEditing(false);
  };

  const handleSave = () => {
    const materialToSave = {
      ...formData,
      prix: parseFloat(formData.prix),
      nombrePortSwitch: parseInt(formData.nombrePortSwitch),
      debitSwitch: parseInt(formData.debitSwitch),
      tailleEcran: parseFloat(formData.tailleEcran),
      idSociete: formData.idSociete === "" ? null : formData.idSociete,
    };

    if (isEditing) {
      // @ts-ignore
      const { Affectation, Emprunt, idSociete, disponibilite, ...rest } =
        materialToSave;
      axios
        .patch(ip + `/materiel/${formData.numeroSerie}`, rest)
        .then((response) => {
          setMateriels(
            materiels.map((materiel) =>
              materiel.numeroSerie === materialToSave.numeroSerie
                ? response.data
                : materiel
            )
          );
          fetchMateriels();
          handleCloseModal();
        })
        .catch((error) =>
          console.error("Probleme modification Materiel", error)
        );
    } else {
      axios
        .post(ip + "/materiel", materialToSave)
        .then((response) => {
          setMateriels([...materiels, response.data]);
          fetchMateriels();
          handleCloseModal();
        })
        .catch((error) => console.error("Erreur ajout Materiel", error));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateMateriel(name, value);
  };
  
  const handleEdit = (rowData) => {
    setFormData(rowData);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(ip + `/materiel/${id}`)
      .then((response) => {
        setMateriels(
          materiels.filter((materiel) => materiel.numeroSerie !== id)
        );
      })
      .catch((error) => {
        console.error("Erreur suppression de matériel ....", error);
      });
  };

  const toggleStatus = (numeroSerie) => {
    const materiel = materiels.find((m) => m.numeroSerie === numeroSerie);
    if (!materiel) {
      console.error("Données Introuvable !!!");
      return;
    }
    const updatedMateriel = {
      ...materiel,
      etatMateriel: ["nouveau", "fonctionnel", "enPanne"].includes(
        materiel.etatMateriel
      )
        ? "rebut"
        : materiel.etatMateriel,
    };
    const { Affectation, Emprunt, idSociete, disponibilite, ...rest } =
      updatedMateriel;
    axios
      .patch(ip + `/materiel/${numeroSerie}`, rest)
      .then((response) => {
        setMateriels(
          materiels.map((m) =>
            m.numeroSerie === numeroSerie ? response.data : m
          )
        );
      })
      .catch((error) => {
        console.error("Erreur archivage etat matériel !!! ", error);
      });
  };

  const handleAffectation = (numeroSerie) => {
    setAffectationData({ ...affectationData, numeroSerie });
    setOpenAffectation(true);
  };

  const handleEmprunt = (numeroSerie) => {
    // @ts-ignore
    setEmpruntData({ ...empruntData, numeroSerie });
    setOpenEmprunt(true);
  };

  const handleView = (numeroSerie) => {
    Navigate(`/detailMateriel/${numeroSerie}`);
  };

  const handleChangeAffectation = (e) => {
    const { name, value } = e.target;
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

  useEffect(() => {
    axios.get(ip + "/societe").then((res) => setSocieties(res.data));
  }, []);

  const handleSaveAffectation = () => {
    Promise.all([
        axios.post(ip + "/affectation",{
          dateAttribution: affectationData.dateAttribution,
          dateRetour:affectationData.dateRetour,
          motifRetour:affectationData.motifRetour,
          idUtilisateur:affectationData.idUtilisateur,
          numeroSerie:affectationData.numeroSerie,
        }),
        axios.patch(`${ip}/materiel/${affectationData.numeroSerie}`, {
          // @ts-ignore
          disponibilite: affectationData.disponibilite,
        }),
      ])
      .then((response) => {
        fetchMateriels();
        setOpenAffectation(false);
      })
      .catch((error) => {console.error("Erreur affectation!", error);});
  };

  const handleSaveEmprunt = () => {
    axios
      .post(ip + "/emprunt", empruntData)
      .then((response) => {
        fetchMateriels();
        setOpenEmprunt(false);
      })
      .catch((error) => console.error("Erreur emprunt!", error));
  };

  const columns = [
    { field: "numeroSerie", headerName: "Numero Serie", width: 150 },
    { field: "categorie", headerName: "Categorie", width: 140 },
    { field: "marque", headerName: "Marque", width: 100 },
    { field: "modele", headerName: "Modele", width: 200 },
    { field: "prix", headerName: "Prix", type: "number", width: 100 },
    { field: "etatMateriel", headerName: "Etat matériel", width: 120 },
    { field: "disponibilite", headerName: "Disponobilité", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 400,
      renderCell: (params) => (
        <div text-align="letf">
          <Button
            title="Voir détails matériel"
            onClick={() => handleView(params.row.numeroSerie)}
          >
            <VisibilityOutlinedIcon />
          </Button>
          <Button
            title="Modifier matériel"
            onClick={() => handleEdit(params.row)}
          >
            <EditNoteIcon />
          </Button>
          <Button
            title="Supprimer matériel"
            onClick={() => handleDelete(params.row.numeroSerie)}
          >
            <DeleteOutlineOutlinedIcon />
          </Button>
          <Button
            title="Archiver matériel"
            onClick={() => toggleStatus(params.row.numeroSerie)}
          >
            <Inventory2OutlinedIcon />
          </Button>
          <Button
            title="Affecter matériel"
            disabled={
              params.row.disponibilite === "Affecté" ||
              params.row.disponibilite === "Emprunté"
            }
            onClick={() => handleAffectation(params.row.numeroSerie)}
          >
            <QueuePlayNextOutlinedIcon />
          </Button>
          <Button
            title="Emprunter Matériel"
            disabled={
              params.row.disponibilite === "Affecté" ||
              params.row.disponibilite === "Emprunté"
            }
            onClick={() => handleEmprunt(params.row.numeroSerie)}
          >
            <ManageHistoryOutlinedIcon />
          </Button>
        </div>
      ),
    },
  ];
  const [pageSize, setPageSize] = useState(25);
  return (
    <div>
      <h1>Gestion de Matériel</h1>
      <Box sx={{ height: 800, width: "100%" }}>
        <Box sx={{ mb: 2 }}>
          <Button onClick={handleOpenModal}
          variant="contained"
          color="primary">
            + Ajouter Materiel
          </Button>
        </Box>
        <Box>
          <DataGrid
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            rows={materiels}
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
            disableSelectionOnClick
            getRowId={(row) => row.numeroSerie}
          />
        </Box>

        <AffectationModal
          affectationData={affectationData}
          openAffectation={openAffectation}
          isEditing={isEditing}
          handleClose={() => setOpenAffectation(false)}
          handleChange={handleChangeAffectation}
          handleSave={handleSaveAffectation}
          errors={errors}
        />

        <EmpruntModal
          openEmprunt={openEmprunt}
          empruntData={empruntData}
          formData={formData}
          isEditing={isEditing}
          handleClose={() => setOpenEmprunt(false)}
          handleChange={handleChangeEmprunt}
          handleSave={handleSaveEmprunt}
          errors={errors}
        />

        <Modal open={open} onClose={handleCloseModal}>
          <Box sx={style}>
            <h2>{isEditing ? "Editer matériel" : "Ajouter matériel"}</h2>

            <TextField
              select
              label="Categorie"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              fullWidth
              margin="normal"
              // @ts-ignore
              error={!!errors.categorie}
              // @ts-ignore
              helperText={errors.categorie}
            >
              {Object.values(Categorie).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Numéro de Série"
              name="numeroSerie"
              value={formData.numeroSerie || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              // @ts-ignore
              error={!!errors.numeroSerie}
              // @ts-ignore
              helperText={errors.numeroSerie}
            />
            <TextField
              label="Marque"
              name="marque"
              value={formData.marque || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              // @ts-ignore
              error={!!errors.marque}
              // @ts-ignore
              helperText={errors.marque}
            />
            <TextField
              label="Modèle"
              name="modele"
              value={formData.modele || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              // @ts-ignore
              error={!!errors.modele}
              // @ts-ignore
              helperText={errors.modele}
            />
            <TextField
              label="Prix"
              name="prix"
              value={formData.prix || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              // @ts-ignore
              error={!!errors.prix}
              // @ts-ignore
              helperText={errors.prix}
            />
            <TextField
              label="Garantie"
              name="garantie"
              value={formData.garantie || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              // @ts-ignore
              error={!!errors.garantie}
              // @ts-ignore
              helperText={errors.garantie}
            />
            <TextField
              select
              label="Etat matériel"
              name="etatMateriel"
              value={formData.etatMateriel || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              // @ts-ignore
              error={!!errors.etatMateriel}
              // @ts-ignore
              helperText={errors.etatMateriel}
            >
              {Object.values(EtatMateriel).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label={"Date d'acquisition"}
              placeholder="Sélectionner une date"
              name="dateAcquisition"
              value={dayjs(formData?.dateAcquisition).format("YYYY-MM-DD")}
              type="date"
              onChange={handleChange}
              fullWidth
              margin="normal"
              // @ts-ignore
              error={!!errors.dateAcquisition}
              // @ts-ignore
              helperText={errors.dateAcquisition}
            />

            <Select
              label="Fournisseur"
              name="idSociete"
              required
              value={formData.idSociete}
              onChange={handleChange}
              fullWidth
              // error={!!errors.idSpecialite}
              // style={{marginTop: '1rem'}}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {societies.map((elem) => (
                <MenuItem key={elem.idSociete} value={elem.idSociete}>
                  {elem.raisonSociale}
                </MenuItem>
              ))}
            </Select>

            {/* ------------------------------------------------------- */}
            {/*Unite Centrale */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.UniteCentrale && (
              <>
                <TextField
                  label="Processeur"
                  name="processeurPC"
                  value={formData.processeurPC || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Memoire Cache"
                  name="memoireCache"
                  value={formData.memoireCache || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  select
                  label="RAM "
                  name="ram"
                  value={formData.ram || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {[
                    "2 Go",
                    "4 Go",
                    "8 Go",
                    "16 Go",
                    "32 Go",
                    "64 Go",
                    "128 Go",
                    "256 Go",
                    "512 Go",
                  ].map((conn) => (
                    <MenuItem key={conn} value={conn}>
                      {conn}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Disque dur"
                  name="disque"
                  value={formData.disque || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Carte Graphique"
                  name="carteGraphique"
                  value={formData.carteGraphique || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
            {/* ------------------------------------------------------- */}
            {/*Ecran */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.Ecran && (
              <TextField
                label="Taille de l'écran"
                name="tailleEcran"
                value={formData.tailleEcran || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            )}

            {/* ------------------------------------------------------- */}
            {/* PC Portable */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.PcPortable && (
              <>
                <TextField
                  label="Processeur"
                  name="processeurPC"
                  value={formData.processeurPC || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Memoire Cache"
                  name="memoireCache"
                  value={formData.memoireCache || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  select
                  label="RAM "
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {[
                    "2 Go",
                    "4 Go",
                    "8 Go",
                    "16 Go",
                    "32 Go",
                    "64 Go",
                    "128 Go",
                    "256 Go",
                    "512 Go",
                  ].map((conn) => (
                    <MenuItem key={conn} value={conn}>
                      {conn}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Disque dur"
                  name="disque"
                  value={formData.disque || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Carte Graphique"
                  name="carteGraphique"
                  value={formData.carteGraphique || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Taille de l'écran"
                  name="tailleEcran"
                  value={formData.tailleEcran || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Etat de batterie"
                  name="etatBatteriePcPortable"
                  value={formData.etatBatteriePcPortable || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
            {/* ------------------------------------------------------- */}
            {/* Imprimante */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.Imprimante && (
              <>
                <TextField
                  label="Vitesse d'impression"
                  name="vitesseImpression"
                  value={formData.vitesseImpression || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  select
                  label="Type de Connexion "
                  name="connexionWLU"
                  value={formData.connexionWLU}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {["WIFI", "LAN", "USB"].map((conn) => (
                    <MenuItem key={conn} value={conn}>
                      {conn}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Technologie d'impression "
                  name="technologieImpression"
                  value={formData.technologieImpression || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {["inkTank", "ecoTank", "Laser", "JetEncre"].map(
                    (techimp) => (
                      <MenuItem key={techimp} value={techimp}>
                        {techimp}
                      </MenuItem>
                    )
                  )}
                </TextField>
                <TextField
                  label="Résolution"
                  name="resolutionScanImpVideoP"
                  value={formData.resolutionScanImpVideoP || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Format de scan"
                  name="formatScanImp"
                  value={formData.formatScanImp || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Fonctions Supplémentaires"
                  name="fonctionSupplementaireScanImp"
                  value={formData.fonctionSupplementaireScanImp || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
            {/* ------------------------------------------------------- */}
            {/* Scanner */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.Scanner && (
              <>
                <TextField
                  label="Vitesse de scan"
                  name="vitesseScanner"
                  value={formData.vitesseScanner || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  select
                  label="Type de Connexion "
                  name="connexionWLU"
                  value={formData.connexionWLU}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {["WIFI", "LAN", "USB"].map((conn) => (
                    <MenuItem key={conn} value={conn}>
                      {conn}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Type Scanner "
                  name="typeScanner"
                  value={formData.typeScanner}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {["Aplat", "ChargeAutomatique"].map((typescan) => (
                    <MenuItem key={typescan} value={typescan}>
                      {typescan}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Résolution"
                  name="resolutionScanImpVideoP"
                  value={formData.resolutionScanImpVideoP || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Format de scan"
                  name="formatScanImp"
                  value={formData.formatScanImp || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Fonctions Supplémentaires"
                  name="fonctionSupplementaireScanImp"
                  value={formData.fonctionSupplementaireScanImp || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
            {/* ------------------------------------------------------- */}
            {/* Onduleur */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.Onduleur && (
              <>
                <TextField
                  label="Poids Onduleur"
                  name="poidsOnduleur"
                  value={formData.poidsOnduleur || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Autonomie Onduleur"
                  name="autonomieOnduleur"
                  value={formData.autonomieOnduleur || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Capacité Onduleur"
                  name="capaciteChargeOnduleur"
                  value={formData.capaciteChargeOnduleur || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  select
                  label="Technologie Onduleur "
                  name="technologieOnduleur"
                  value={formData.technologieOnduleur}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {["off_line", "on_line", "in_line"].map((techond) => (
                    <MenuItem key={techond} value={techond}>
                      {techond}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}

            {/* ------------------------------------------------------- */}
            {/* Video Projecteur */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.VideoProjecteur && (
              <>
                <TextField
                  label=" Résolution"
                  name="resolutionScanImpVideoP"
                  value={formData.resolutionScanImpVideoP || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          formData?.entreeHDMI_VideoProjecteur ??
                          state.entreeHDMI_VideoProjecteur
                        }
                        onChange={handleCheckboxChange}
                        name="entreeHDMI_VideoProjecteur"
                      />
                    }
                    label="HDMI"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          formData?.entreeVGA_VideoProjecteur ??
                          state.entreeVGA_VideoProjecteur
                        }
                        onChange={handleCheckboxChange}
                        name="entreeVGA_VideoProjecteur"
                      />
                    }
                    label="VGA"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          formData?.entreeUSB_VideoProjecteur ??
                          state.entreeUSB_VideoProjecteur
                        }
                        onChange={handleCheckboxChange}
                        name="entreeUSB_VideoProjecteur"
                      />
                    }
                    label="USB"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          formData?.entreeLAN_VideoProjecteur ??
                          state.entreeLAN_VideoProjecteur
                        }
                        onChange={handleCheckboxChange}
                        name="entreeLAN_VideoProjecteur"
                      />
                    }
                    label="LAN"
                  />
                </FormGroup>
              </>
            )}

            {/* ------------------------------------------------------- */}
            {/* Serveur */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.Serveur && (
              <>
                <TextField
                  label="Processeur"
                  name="processeurPC"
                  value={formData.processeurPC || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Memoire Cache"
                  name="memoireCache"
                  value={formData.memoireCache || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  select
                  label="RAM "
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  {[
                    "2 Go",
                    "4 Go",
                    "8 Go",
                    "16 Go",
                    "32 Go",
                    "64 Go",
                    "128 Go",
                    "256 Go",
                    "512 Go",
                  ].map((conn) => (
                    <MenuItem key={conn} value={conn}>
                      {conn}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Disque dur"
                  name="disque"
                  value={formData.disque || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Carte Graphique"
                  name="carteGraphique"
                  value={formData.carteGraphique || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Nombre de disques"
                  name="nombreDisque"
                  value={formData.nombreDisque || ""}
                  onChange={handleChange}
                  type="number"
                  required
                  fullWidth
                  margin="normal"
                />
              </>
            )}
            {/* ------------------------------------------------------- */}
            {/* Switch */}
            {/* ------------------------------------------------------- */}
            {formData.categorie === Categorie.Switch && (
              <>
                <TextField
                  label=" Nombre de Ports"
                  name="nombrePortSwitch"
                  value={formData.nombrePortSwitch || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  margin="normal"
                />

                <TextField
                  label=" Débit"
                  name="debitSwitch"
                  value={formData.debitSwitch || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  margin="normal"
                />

                <TextField
                  label=" Technologie Switch"
                  name="technologieSwitch"
                  value={formData.technologieSwitch || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}

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
                onClick={handleSave}
              >
                {isEditing ? <FaRegSave /> : <IoPersonAddOutline />}
                {isEditing ? " Enregistrer" : " Ajouter"}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};
export default MaterielPage;
