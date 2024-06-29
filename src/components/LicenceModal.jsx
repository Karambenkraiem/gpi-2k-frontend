import axios from "axios";
import { ip } from "constants/ip";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";

const LicenceModal = ({
  openModal,
  handleClose,
  isEditing,
  licenceData,
  handleChange,
  handleSave,
}) => {
  const [societes, setSocietes] = useState([]);
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

  const StatutLicence = {
    Assignée: "Assignée",
    Disponible: "Disponible",
  };

  const fetchSocietes = () => {
    axios.get(`${ip}/societe`).then((res) => setSocietes(res.data));
  };

  useEffect(() => {
    fetchSocietes();
  }, []);

  return (
    <Modal open={openModal} onClose={handleClose}>
      <Box sx={style}>
        <h2>{isEditing ? "Modifier une licence" : "Ajouter une licence"}</h2>

        <TextField
          label="N° de licence"
          name="numeroLicence"
          required
          value={licenceData.numeroLicence}
          type="text"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label={"Date d'activation"}
          placeholder="Date d'activation"
          name="dateActivation"
          value={dayjs(licenceData?.dateActivation).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label={"Date d'expiration"}
          placeholder="Date d'expiration"
          name="dateExpiration"
          value={dayjs(licenceData?.dateExpiration).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="Prix Licence"
          name="prixLicence"
          required
          value={licenceData.prixLicence}
          type="text"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <InputLabel htmlFor="statutLicence">Statut</InputLabel>

        <Select
          label="Statut"
          name="statutLicence"
          required
          value={licenceData.statutLicence}
          onChange={handleChange}
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          {Object.values(StatutLicence).map((elem) => (
            <MenuItem key={elem} value={elem}>
              {elem}
            </MenuItem>
          ))}
        </Select>

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

export default LicenceModal;
