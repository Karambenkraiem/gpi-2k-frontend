import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";
import dayjs from "dayjs";

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

const ContratModal = ({ open, handleClose, editItem }) => {
  const [contrats, setContrats] = useState([]);

  const [formData, setFormData] = useState({
    dateDebutContrat: '',
    dateFinContrat: '',
    montantContrat: '',
    descriptionContrat: '',
    contratRenouvable: '',
    typeContrat: '',
    etatContrat: 'Pret à signer',
  });

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    const contratToSave = {
      ...formData,
      dateDebutContrat: formData.dateDebutContrat
        ? new Date().toISOString()
        : "-",
      dateFinContrat: formData.dateFinContrat
        ? new Date().toISOString()
        : "-",
      montantContrat: parseFloat(formData.montantContrat),
    };
    if (editItem) {
      // @ts-ignore
      const { Signature, ...rest } = contratToSave;
      axios
        .patch(`${ip}/contrat/${contratToSave.idContrat}`, rest)
        .then((response) => {
          setContrats(
            contrats.map((contrat) =>
              contrat.idContrat === contratToSave.idContrat
                ? response.data
                : contrat
            )
          );
          handleClose();
        })
        .catch((error) => console.error("Error updating Contrat:", error));
    } else {
      axios
        .post(ip + "/contrat", contratToSave)
        .then((response) => {
          setContrats([...contrats, response.data]);
          handleClose();
        })
        .catch((error) => {
          console.error("Error Ajout Contrat: !!!! ", error);
        });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <h2 id="modal-title">{editItem ? "Éditer" : "Ajouter"} Contrat</h2>

        <TextField
          label="Date début de contrat"
          placeholder="Sélectionner une date"
          name="dateDebutContrat"
          value={dayjs(formData.dateDebutContrat).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.dateAcquisition}
          // // @ts-ignore
          // helperText={errors.dateAcquisition}
        />
        <TextField
          label="Date fin de contrat"
          placeholder="Sélectionner une date"
          name="dateFinContrat"
          value={dayjs(formData.dateFinContrat).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.dateAcquisition}
          // // @ts-ignore
          // helperText={errors.dateAcquisition}
        />

        <TextField
          label="Montant de contrat"
          name="montantContrat"
          value={formData.montantContrat}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Description de contrat"
          name="descriptionContrat"
          value={formData.descriptionContrat}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormControlLabel
          control={
            <Switch
              name="contratRenouvable"
              checked={formData.contratRenouvable}
              onChange={handleChange}
              color="primary"
              //   disabled={!!editItem}
            />
          }
          label="Renouvelable ou Non"
        />

        <TextField
          select
          name="typeContrat"
          label="Type de Contrat"
          value={formData.typeContrat || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {["Achat", "Service", "Achat_Service"].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          name="etatContrat"
          label="Etat Contrat"
          value={formData.etatContrat || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {["Pret à signer", "actif", "inactif", "suspendu"].map((etat) => (
            <MenuItem key={etat} value={etat}>
              {etat}
            </MenuItem>
          ))}
        </TextField>

        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editItem ? "Éditer" : "Ajouter"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ContratModal;
