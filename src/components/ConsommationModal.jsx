import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { ip } from "constants/ip";

const ConsommationModal = ({
  consommationData,
  openConsommationModal,
  handleClose,
  handleChange,
  handleSaveConsommation,
}) => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [materiels,setMateriels] = useState([])
  const fetchUtilisateurs = () => {
    axios
      .get(ip + "/utilisateur")
      .then((response) => {
        setUtilisateurs(response.data);
      })
      .catch((error) => console.error("Error fetching data", error));
  };
  const fetchMateriels = ()  => {
    axios
      .get(ip + "/materiel")
      .then((response) => {
        setMateriels(response.data);
      })
      .catch((error) => console.error("Error fetching data", error));
  };

  useEffect(() => {
    fetchUtilisateurs();
    fetchMateriels();
  },[]);

  // const handleSubmit = () => {
  //   axios.post(ip + "/alimentation", consommationData).then((response) => {
  //     fetchStock();
  //   });

    // onSave(quantity);
    // handleClose();
  // };

  
  return (
    <Modal open={openConsommationModal} onClose={handleClose}>
      <Box sx={{ ...style, width: 400 }}>
        <h2>Consommer Stock</h2>
        <TextField
          label="Référence Article"
          value={consommationData.refArt}
          fullWidth
          disabled
        />

        <TextField
      label="Quantité consommer"
      name="quantiteConsomme"
      type="number"
      value={consommationData.quantiteConsomme}
      onChange={handleChange}
      fullWidth
      margin="normal"
    />


        <TextField
          select
          label="Utilisateur"
          name="idUtilisateur"
          value={consommationData?.idUtilisateur}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.categorie}
          // // @ts-ignore
          // helperText={errors.categorie}
        >
          {utilisateurs.map((elem) => (
            <MenuItem key={elem?.idUtilisateur} value={elem?.idUtilisateur}>
              {elem?.fullName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Materiel"
          name="numeroSerie"
          value={consommationData?.numeroSerie}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.categorie}
          // // @ts-ignore
          // helperText={errors.categorie}
        >
          {materiels.map((elem) => (
            <MenuItem key={elem?.numeroSerie} value={elem?.numeroSerie}>
              {elem?.categorie}{elem?.marque}{elem?.modele}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={"Date Consommation"}
          placeholder="Sélectionner une date"
          name="dateConsommation"
          value={dayjs(consommationData.dateConsommation).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.dateAcquisition}
          // // @ts-ignore
          // helperText={errors.dateAcquisition}
        />
        <Button variant="contained" color="primary" onClick={handleSaveConsommation}>
          Save
        </Button>
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

export default ConsommationModal;
