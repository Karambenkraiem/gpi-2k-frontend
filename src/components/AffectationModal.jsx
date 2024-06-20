import { Box, MenuItem, TextField,Button,
    Modal, } from '@mui/material'
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

import { FaRegSave } from 'react-icons/fa'

const AffectationModal = ({
    affectationData,
    openAffectation,
    handleClose,
    handleChange,
    handleSave,
    errors,
}) => {
    const [utilisateurs, setUtilisateurs] = useState([]);

      const fetchUtilisateurs = () => {
        axios
          .get("http://localhost:3000/utilisateur")
          .then((response) => {
            setUtilisateurs(response.data);
            // setLoading(false);
          })
          .catch((error) => console.error("Error fetching data:", error));
      };

      useEffect(()=>{
        fetchUtilisateurs();
      })

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
              label={"Date d'affectation"}
              placeholder="Sélectionner une date"
              name="dateAttribution"
              value={dayjs(affectationData?.dateAttribution).format(
                "YYYY-MM-DD"
              )}
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
              value={dayjs(affectationData?.dateRetour).format("YYYY-MM-DD")}
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
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{ mt: 2 }}
              color="primary"
            >
              <FaRegSave />_ Enregistrer
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
            >
              Annuler
            </Button>
          </Box>
        </Modal>
  )
}

export default AffectationModal