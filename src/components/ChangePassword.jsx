import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Snackbar,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { ip } from "constants/ip";
import { patchWithHeaders, postWithHeaders } from "helpers/axiosWithHeaders";

const ChangePassword = ({ openPasswordModal, handleClose,setMessageError }) => {
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handlSave = async () => {
    try {
      const response = await postWithHeaders("/auth/change-password", formData);
      console.log("====================================");
      console.log(response.data);
      console.log("====================================");
      handleClose();
    } catch (error) {
      setMessageError(error.response.data.message)
    }
  };

  return (
    <Modal open={openPasswordModal} onClose={handleClose}>
      <Box sx={{ ...style, width: 400 }}>
        <h2>Changer mot de passe</h2>

        <TextField
          label="Ancien mot de passe"
          name="password"
          type="password"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Nouveau mot de passe"
          name="newPassword"
          type="password"
          onChange={handleChange}
          fullWidth
          margin="normal"
        ></TextField>
        <TextField
          label="Confirmer nouveau mot de passe"
          name="newPasswordConfirm"
          type="password"
          onChange={handleChange}
          fullWidth
          margin="normal"
        ></TextField>

        <div className="d-flex gap-5 p-3 justify-content-center">
          <Button variant="contained" color="primary" onClick={handlSave}>
            Enregistrer
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Annuler
          </Button>
        </div>
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

export default ChangePassword;
