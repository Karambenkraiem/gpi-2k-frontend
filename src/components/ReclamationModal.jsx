import { Box, Button, MenuItem, Modal, TextField } from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";
import React, { useEffect, useState } from "react";

const ReclamationModal = ({ 
  openReclamation, 
  handleCloseModalReclamation 
}) => {
  const [materiels, setMateriels] = useState([]);
  const fetchMateriels = () => {
    axios
      .get(ip + "/materiel")
      .then((response) => {
        setMateriels(response.data);
      })
      .catch((error) => console.error("Error fetching data", error));
  };

  useEffect(() => {
    fetchMateriels();
  }, []);

  return (
    <Modal open={openReclamation} onClose={handleCloseModalReclamation}>
      <Box sx={{ ...style, width: 400 }}>
        <h2>Reclamer un incident</h2>

       
        <TextField
          select
          label="Utilisateur"
          name="idUtilisateur"
          value={448}
          onChange={null}
          fullWidth
          margin="normal"
      
        >
        </TextField>
        <TextField
          select
          label="Materiel"
          name="numeroSerie"
          value={null}
          onChange={null}
          fullWidth
          margin="normal"

        >
          {materiels.map((elem) => (
            <MenuItem key={elem?.numeroSerie} value={elem?.numeroSerie}>
              {elem?.categorie}
              {elem?.marque}
              {elem?.modele}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={"Date Consommation"}
          placeholder="Sélectionner une date"
          name="dateConsommation"
          // value={format("YYYY-MM-DD")}
          type="date"
          onChange={null}
          fullWidth
          margin="normal"
       
        />
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Button variant="contained" color="primary" sx={{ flex: 1 }}>
            Valider
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseModalReclamation}
            sx={{ flex: 1 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default ReclamationModal;
