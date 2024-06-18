import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
import axios from "axios";
import { ip } from "constants/ip";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuClipboardEdit } from "react-icons/lu";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";

const MaterielPage = () => {
  const [materiels, setMateriels] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [societies, setSocieties] = useState([]);

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
    maxHeight: "90vh", // Allows the modal to scroll if content overflows
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
  const [formData, setFormData] = useState({
    numeroSerie: "",
    categorie: "",
    marque: "",
    modele: "",
    prix: "",
    garantie: "",
    etatMateriel: "",
    dateAcquisition: new Date().toISOString(),
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
    entreeHDMI_VideoProjecteur: false,
    entreeVGA_VideoProjecteur: false,
    entreeUSB_VideoProjecteur: false,
    entreeLAN_VideoProjecteur: false,
  });

  useEffect(() => {
    fetchMateriels();
  }, []);

  const fetchMateriels = () => {
    axios
      .get("http://localhost:3000/materiel")
      .then((response) => {
        setMateriels(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  /////////////////////////////////////////////////
  const handleOpen = (materiel = null) => {
    if (materiel) {
      setFormData(materiel);
      setIsEditing(true);
    } else {
      setFormData({
        numeroSerie: "",
        categorie: "",
        marque: "",
        modele: "",
        prix: "",
        garantie: "",
        etatMateriel: "",
        dateAcquisition: new Date().toISOString(),
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
        entreeHDMI_VideoProjecteur: false,
        entreeVGA_VideoProjecteur: false,
        entreeUSB_VideoProjecteur: false,
        entreeLAN_VideoProjecteur: false,
      });
      setIsEditing(false);
    }
    setOpen(true);
  };
  //////////////////////////////////

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
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
    };

    if (isEditing) {
      // @ts-ignore
      const { Societe, ...rest } = materialToSave;
      axios
        .patch(`http://localhost:3000/materiel/${formData.numeroSerie}`, rest)
        .then((response) => {
          setMateriels(
            materiels.map((materiel) =>
              materiel.numeroSerie === materialToSave.numeroSerie
                ? response.data
                : materiel
            )
          );
          // fetchMateriels ();
          handleCloseModal();
        })
        .catch((error) =>
          console.error("Probleme modification Materiel", error)
        );
    } else {
      axios
        .post("http://localhost:3000/materiel", materialToSave)
        .then((response) => {
          setMateriels([...materiels, response.data]);
          // fetchMateriels ();
          handleCloseModal();
        })
        .catch((error) => console.error("Erreur ajout Materiel", error));
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleEdit = (rowData) => {
    setFormData(rowData);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/materiel/${id}`)
      .then((response) => {
        setMateriels(
          materiels.filter((materiel) => materiel.numeroSerie !== id)
        );
      })
      .catch((error) => {
        console.error("Erreur suppression de materiel ....", error);
      });
  };

  const columns = [
    { field: "numeroSerie", headerName: "Numero Serie", flex: 1 },
    { field: "categorie", headerName: "Categorie", flex: 1 },
    { field: "marque", headerName: "Marque", flex: 1 },
    { field: "modele", headerName: "Modele", flex: 1 },
    { field: "prix", headerName: "Prix", type: "number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => (
        <div text-align="center">
          <Button onClick={() => handleEdit(params.row)}>
            <LuClipboardEdit />
          </Button>
          <Button onClick={() => handleDelete(params.row.numeroSerie)}>
            <RiDeleteBin6Line />
          </Button>
        </div>
      ),
    },
  ];

  const [state, setState] = useState({
    entreeHDMI_VideoProjecteur: false,
    entreeVGA_VideoProjecteur: false,
    entreeUSB_VideoProjecteur: false,
    entreeLAN_VideoProjecteur: false,
  });

  useEffect(() => {
    axios.get(ip + "/societe").then((res) => setSocieties(res.data));
  }, []);
  const rows = materiels.map((row, index) => ({
    id: index, // or use a unique field from your data, e.g., row.numeroSerie
    ...row,
  }));
  return (
    <div>
      <h1>Gestion de Matériel</h1>
      <Box sx={{ height: 800, width: "100%" }}>
        <Box sx={{ mb: 2 }}>
          <Button onClick={handleOpenModal} variant="contained" color="primary">
            + Ajouter Materiel
          </Button>
        </Box>

        <DataGrid
          rows={materiels}
          // @ts-ignore
          // pageSize={5}
          // rowsPerPageOptions={[5, 10, 20]}
          // checkboxSelection
          columns={columns}
          loading={loading}
          disableSelectionOnClick
          onRowDoubleClick={handleEdit}
          getRowId={(row) => row.numeroSerie}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[100]}
        />
        <Modal open={open} onClose={handleCloseModal}>
          <Box sx={style}>
            <h2>{isEditing ? "Edit Materiel" : "Add Materiel"}</h2>

            <TextField
              select
              label="Categorie"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              fullWidth
              margin="normal"
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
            />
            <TextField
              label="Marque"
              name="marque"
              value={formData.marque || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Modèle"
              name="modele"
              value={formData.modele || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Prix"
              name="prix"
              value={formData.prix || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Garantie"
              name="garantie"
              value={formData.garantie || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Etat Materiel"
              name="etatMateriel"
              value={formData.etatMateriel || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {Object.values(EtatMateriel).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            {/* <TextField
              label="Date d'acquisition"
              placeholder="Sélectionner une date"
              name="dateAcquisition"
              type="date"
              value={formData.dateAcquisition || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            /> */}

            <TextField
              label={open ? "Date d'acquisition" : ""}
              placeholder="Sélectionner une date"
              name="dateAcquisition"
              value={!open ? "" : "_"}
              type="date"
              onChange={handleChange}
              fullWidth
              margin="normal"
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
              {societies.map((elem) => (
                <MenuItem key={elem.idSociete} value={elem.idSociete}>
                  {elem.raisonSociale}
                </MenuItem>
              ))}
            </Select>

            {/* <TextField
            label="Fournisseur"
            name="idSociete"
            value={formData.idSociete || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          /> */}
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
                  {["2", "4", "8", "16", "32", "64", "128", "256", "512"].map(
                    (conn) => (
                      <MenuItem key={conn} value={conn}>
                        {conn}
                      </MenuItem>
                    )
                  )}
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
                  label="Vitesse de l'impression"
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
                  label="Fonction Supplementaire"
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
                  label="Resolution"
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
                  label="Fonction Supplementaire"
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
                        checked={state.entreeHDMI_VideoProjecteur}
                        onChange={() =>
                          setState((prevState) => ({
                            ...prevState,
                            entreeHDMI_VideoProjecteur:
                              !prevState.entreeHDMI_VideoProjecteur,
                          }))
                        }
                      />
                    }
                    label="HDMI"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.entreeVGA_VideoProjecteur}
                        onChange={() =>
                          setState((prevState) => ({
                            ...prevState,
                            entreeVGA_VideoProjecteur:
                              !prevState.entreeVGA_VideoProjecteur,
                          }))
                        }
                      />
                    }
                    label="VGA"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.entreeUSB_VideoProjecteur}
                        onChange={() =>
                          setState((prevState) => ({
                            ...prevState,
                            entreeUSB_VideoProjecteur:
                              !prevState.entreeUSB_VideoProjecteur,
                          }))
                        }
                      />
                    }
                    label="USB"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.entreeLAN_VideoProjecteur}
                        onChange={() =>
                          setState((prevState) => ({
                            ...prevState,
                            entreeLAN_VideoProjecteur:
                              !prevState.entreeLAN_VideoProjecteur,
                          }))
                        }
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
                  label=" Debit"
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

            <Button
              onClick={handleSave}
              variant="contained"
              sx={{ mt: 2 }}
              color="primary"
            >
              {isEditing ? <FaRegSave /> : <IoPersonAddOutline />}
              {isEditing ? "_ Enregistrer" : "_ Ajouter"}
            </Button>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
            >
              Annuler
            </Button>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};
export default MaterielPage;
