import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SocieteModal = ({ open, handleClose, editItem }) => {
  const [societeData, setSocieteData] = useState({
    raisonSociale: "",
    adresse: "",
    responsable: "",
    email: "",
    numtel: "",
    secteurActivite: "",
    typeSociete: "",
  });


  useEffect(() => {
    if (editItem) {
      setSocieteData(editItem);
      // fetchSociete();
    } else {
      setSocieteData({
        raisonSociale: "",
        adresse: "",
        responsable: "",
        email: "",
        numtel: "",
        secteurActivite: "",
        typeSociete: "",
      });

    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocieteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 

  
  const [societes, setSocietes] = useState([]);

  const handleSaveSociete = () => {
    const societeToSave = { ...societeData };

    if (editItem) {
      
      const { Alimentation, Materiel, Logiciel, ...rest } = societeToSave;
      axios
        .patch(`${ip}/societe/${societeToSave.idSociete}`, rest)
        .then((response) => {
          setSocietes(
            societes.map((societe) =>
              societe.idSociete === societeToSave.idSociete
                ? response.data
                : societe
            )
          );
          handleClose();
        })
        .catch((error) => console.error('Error updating stock:', error));
    }else{
        axios.post(ip+'/societe', societeToSave)
        .then((response) => {
            setSocietes([...societes,response.data]);
          handleClose();
        })
        .catch((error) => {
            console.error('Error Ajout societes:', error);
        });
    }
  };

  

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <h2>{editItem ? "Edit Societé" : "Add Societé"}</h2>
        <TextField
          fullWidth
          margin="normal"
          name="raisonSociale"
          label="Raison Sociale"
          value={societeData.raisonSociale}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="adresse"
          label="Adresse"
          value={societeData.adresse}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="responsable"
          label="Responsable"
          value={societeData.responsable}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          value={societeData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="numtel"
          label="Numéro Téléphone"
          value={societeData.numtel}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="secteurActivite"
          label="Secteur Activité"
          value={societeData.secteurActivite}
          onChange={handleChange}
        />
        <TextField
          select
          name="typeSociete"
          label="Type Societe"
          value={societeData.typeSociete || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {[null, "FOURNISSEUR", "PRESTATAIRE", "FOURNISSEUR_PRESTATAIRE"].map(
            (type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            )
          )}
        </TextField>
        <Button onClick={handleSaveSociete} variant="contained" color="primary">
          {editItem ? "Update" : "Add"}
        </Button>
      </Box>
    </Modal>
  );
};

export default SocieteModal;
