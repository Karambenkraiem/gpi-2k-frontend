import {
  Box,
  MenuItem,
  TextField,
  Button,
  Modal,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";
import dayjs from "dayjs";
import Emprunt from "pages/Emprunt";
import React, { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";

const InstallLicenceModal = ({
  installationData,
  openInstallModal,
  isEditing,
  handleClose,
  handleChange,
  handleSave,
}) => {
  const [materiels, setMateriels] = useState([]);
  const StatutLicence = {
    Assignée: "Assignée",
    Disponible: "Disponible",
  };

  const fetchMateriels = () => {
    axios
      .get(ip + "/materiel")
      .then((response) => {
        setMateriels(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchMateriels();
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
    <Modal open={openInstallModal}>
      <Box sx={style}>
        <h2>{isEditing ? "Retirer licence" : "Assigner licence"}</h2>

        <TextField
          label="N° Licence"
          name="numeroLicence"
          value={installationData.numeroLicence}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="text"
        />

        <InputLabel htmlFor="materiels">Matéreil</InputLabel>

        <Select
          label="Matériel"
          name="numeroSerie"
          required
          value={installationData.numeroSerie}
          onChange={handleChange}
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          {materiels.map((elem) => (
            <MenuItem key={elem.numeroSerie} value={elem.numeroSerie}>
              {elem.categorie + " " + elem.marque + " " + elem.numeroSerie}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label={"Date d'installation"}
          placeholder="Sélectionner une date"
          name="dateInstallation"
          value={dayjs(installationData?.dateInstallation).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {
          // @ts-ignore
          isEditing && (
            <TextField
              label={"Date désinstallation"}
              placeholder="Sélectionner une date"
              name="dateDesinstallation"
              value={dayjs(installationData?.dateDesinstallation).format(
                "YYYY-MM-DD"
              )}
              type="date"
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )
        }
        <TextField
          select
          label="Statut de la licence"
          name="statutLicence"
          value={installationData.statutLicence}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {Object.values(StatutLicence).map((etat) => (
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

export default InstallLicenceModal;
