import { Box, MenuItem, TextField, Button, Modal } from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";

const AffectationModal = ({
  affectationData,
  openAffectation,
  isEditing,
  handleClose,
  handleChange,
  handleSave,
  errors,
}) => {

  const [utilisateurs, setUtilisateurs] = useState([]);
  const EtatAffectation = {
    Affecté: "Affecté",
    Emprunté: "Emprunté",
    Disponible: "Disponible",
  };
  
  const fetchUtilisateurs = () => {
    axios
      .get(ip + "/utilisateur")
      .then((response) => {
        setUtilisateurs(response.data);
        // setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchUtilisateurs();
    //fetchMateriel();
  });

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

  return (
    <Modal open={openAffectation}>
      <Box sx={style}>
        <h2>{isEditing ? "Modifier affectation" : "Affecter matériel"}</h2>
        <TextField
          select
          label="Utilisateur"
          name="idUtilisateur"
          value={affectationData.idUtilisateur}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.categorie}
          // @ts-ignore
          helperText={errors.categorie}
        >
          {utilisateurs.map((elem) => (
            <MenuItem
              key={elem.idUtilisateur}
              value={elem.idUtilisateur}
            >
              {elem.fullName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={"Date d'affectation"}
          placeholder="Sélectionner une date"
          name="dateAttribution"
          value={dayjs(affectationData?.dateAttribution).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.dateAttribution}
          // @ts-ignore
          helperText={errors.dateAttribution}
        />
        <TextField
          label={"Date Retour"}
          placeholder="Sélectionner une date"
          name="dateRetour"
          value={dayjs(affectationData.dateRetour).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.dateRetour}
          // @ts-ignore
          helperText={errors.dateRetour}
        />
        <TextField
          label="Motif Retour"
          name="motifRetour"
          value={affectationData.motifRetour || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.motifRetour}
          // @ts-ignore
          helperText={errors.motifRetour}
        />
        <TextField
          select
          label="Etat affectation"
          name="disponibilite"
          value={affectationData?.disponibilite}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.categorie}
          // @ts-ignore
          helperText={errors.categorie}
        >
          {Object.values(EtatAffectation).map((etat) => (
            <MenuItem key={etat} value={etat}>
              {etat}
            </MenuItem>
          ))}
        </TextField>
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

          <Button
            onClick={handleClose}
            variant="contained"
            color="secondary"
            sx={{ flexGrow: 1 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AffectationModal;
