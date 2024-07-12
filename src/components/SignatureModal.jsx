import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { ip } from "constants/ip";

const SignatureModal = ({
  signatureData,
  openSignatureModal,
  handleClose,
  handleChange,
  handleSaveSignature,
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
  }, []);

  // const handleSubmit = () => {
  //   axios.post(ip + "/Signature", signatureData).then((response) => {
  //     fetchStock();
  //   });

  // onSave(quantity);
  // handleClose();
  // };

  return (
    <Modal open={openSignatureModal} onClose={handleClose}>
      <Box sx={{ ...style, width: 400 }}>
        <h2>Signer un Contrat</h2>
        <TextField
          label="Référence de contrat"
          value={signatureData.idContrat}
          fullWidth
          disabled
        />

        <TextField
           label={"Date de Signature"}
           placeholder="Sélectionner une date"
           name="dateSignature"
           value={dayjs(signatureData.dateSignature).format("YYYY-MM-DD")}
           type="date"
           onChange={handleChange}
           fullWidth
           margin="normal"
        />

        <TextField
          select
          label="Societe"
          name="idSociete"
          value={signatureData?.idSociete}
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.categorie}
          // // @ts-ignore
          // helperText={errors.categorie}
        >
          {societes.map((elem) => (
            <MenuItem key={elem?.idSociete} value={elem?.idSociete}>
              {elem?.raisonSociale}
            </MenuItem>
          ))}
        </TextField>
        

        {/* <TextField
          label={"Date de Signature"}
          placeholder="Sélectionner une date"
          name="dateSignature"
          value={dayjs(signatureData.dateSignature).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
          // // @ts-ignore
          // error={!!errors.dateAcquisition}
          // // @ts-ignore
          // helperText={errors.dateAcquisition}
        /> */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSignature}
        >
          Signer
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

export default SignatureModal;
