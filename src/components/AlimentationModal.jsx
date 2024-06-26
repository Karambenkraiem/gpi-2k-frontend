import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { ip } from "constants/ip";

const AlimentationModal = ({
  alimentationData,
  openAlimentationModal,
  handleClose,
  handleChange,
  handleSaveAlimentation,
}) => {
  const [societes, setSocietes] = useState([]);
  const fetchSocietes = () => {
    axios
      .get(ip + "/societe")
      .then((response) => {
        setSocietes(response.data);
      })
      .catch((error) => console.error("Error fetching data", error));
  };

  useEffect(() => {
    fetchSocietes();
  });

  // const handleSubmit = () => {
  //   axios.post(ip + "/alimentation", alimentationData).then((response) => {
  //     fetchStock();
  //   });

    // onSave(quantity);
    // handleClose();
  // };

  
  return (
    <Modal open={openAlimentationModal} onClose={handleClose}>
      <Box sx={{ ...style, width: 400 }}>
        <h2>Alimenter Stock</h2>
        <TextField
          label="Référence Article"
          value={alimentationData.refArt}
          fullWidth
          disabled
        />


        <TextField
      label="Quantité à Alimenter"
      name="quantiteAlimente"
      type="number"
      value={alimentationData.quantiteAlimente}
      onChange={handleChange}
      fullWidth
      margin="normal"
    />


        <TextField
          select
          label="Fournisseur"
          name="idSociete"
          value={alimentationData?.idSociete}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.categorie}
          // // @ts-ignore
          // helperText={errors.categorie}
        >
          {societes.map((societe) => (
            <MenuItem key={societe?.idSociete} value={societe?.idSociete}>
              {societe?.raisonSociale}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={"Date d'alimentation"}
          placeholder="Sélectionner une date"
          name="dateAcquisition"
          value={dayjs(alimentationData?.dateAcquisition).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.dateAcquisition}
          // // @ts-ignore
          // helperText={errors.dateAcquisition}
        />
        <Button variant="contained" color="primary" onClick={handleSaveAlimentation}>
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

export default AlimentationModal;
