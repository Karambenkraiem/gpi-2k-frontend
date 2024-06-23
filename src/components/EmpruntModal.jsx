import { Box, MenuItem, TextField, Button, Modal } from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";

const EmpruntModal = ({
  empruntData,
  openEmprunt,
  isEditing,
  handleClose,
  handleChange,
  handleSave,
  errors,
}) => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const EtatEmprunt = {
    Affecté: "Affecté",
    Emprunté: "Emprunté",
    Disponible: "Disponible",
  };

  const RefProjet = {
    TERG: "TERG-",
    TERX: "TERX-",
    TERY: "TERY-",
    TERA: "TERA-",
    TEPG: "TEPG-",
    TEPX: "TEPX-",
    TEPY: "TEPY-",
    TEPA: "TEPA-",
    ADMINISTRATIF: "ADMINISTRATIF",
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
    <Modal open={openEmprunt}>
      <Box sx={style}>
        <h2>{isEditing ? "Modifier emprunt" : "Emprunter matériel"}</h2>
        <TextField
          select
          label="Utilisateur"
          name="idUtilisateur"
          value={empruntData.idUtilisateur}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.categorie}
          // @ts-ignore
          helperText={errors.categorie}
        >
          {utilisateurs.map((utilisateur) => (
            <MenuItem
              key={utilisateur.idUtilisateur}
              value={utilisateur.idUtilisateur}
            >
              {utilisateur.fullName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={"Date d'emprunt"}
          placeholder="Sélectionner une date"
          name="dateEmprunt"
          value={dayjs(empruntData?.dateEmprunt).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.dateEmprunt}
          // @ts-ignore
          helperText={errors.dateEmprunt}
        />
        <TextField
          label={"Date Restitution"}
          placeholder="Sélectionner une date"
          name="dateRestitution"
          value={dayjs(empruntData?.dateRestitution).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.dateRestitution}
          // @ts-ignore
          helperText={errors.dateRestitution}
        />
        <TextField
          label="Référence projet"
          name="refProjet"
          value={empruntData.refProjet || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.refProjet}
          helperText={errors.refProjet}
          InputProps={{
            endAdornment: (
              <TextField
                select
                value=""
                onChange={(e) =>
                  handleChange({
                    target: { name: "refProjet", value: e.target.value },
                  })
                }
              >
                {Object.values(RefProjet).map((etat) => (
                  <MenuItem key={etat} value={etat}>
                    {etat}
                  </MenuItem>
                ))}
              </TextField>
            ),
          }}
        />
        <TextField
          label="Etat matériel restitué"
          name="etatMatRestitution"
          value={empruntData.etatMatRestitution}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.categorie}
          // @ts-ignore
          helperText={errors.categorie}
        ></TextField>
        <TextField
          select
          label="Etat équipement"
          name="etatEmprunt"
          value={empruntData.etatEmprunt}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // @ts-ignore
          error={!!errors.categorie}
          // @ts-ignore
          helperText={errors.categorie}
        >
          {Object.values(EtatEmprunt).map((etat) => (
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

export default EmpruntModal;
