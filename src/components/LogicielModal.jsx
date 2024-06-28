import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";

const LogicielModal = ({
  openModal,
  isEditing,
  logicielData,
  handleChange,
  handleSave,
  handleClose,
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

  const TypeLogiciel = {
    bureautique: "Bureautique",
    technique: "Technique",
  };

  const fetchSocietes = ()=>{
    axios
    .get(`${ip}/societe`)
    .then((res)=>setSocietes(res.data));
  }

  useEffect(()=>{
    fetchSocietes();
  }, []);

  return (
    <Modal open={openModal} onClose={null}>
      <Box sx={style}>
        <h2>{isEditing ? "Modifier logiciel" : "Ajouter logiciel"}</h2>

        <InputLabel htmlFor="typeLogiciel">Catégorie</InputLabel>

        <Select
          label="Catégorie"
          name="typeLogiciel"
          required
          value={logicielData.typeLogiciel}
          onChange={handleChange}
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          {Object.values(TypeLogiciel).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Libellé"
          name="libelle"
          required
          value={logicielData.libelle}
          type="text"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Version"
          name="version"
          required
          value={logicielData.version}
          type="text"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Editeur"
          name="editeur"
          required
          value={logicielData.editeur}
          type="text"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label={"Date d'acquisition"}
          placeholder="Date d'acquisition"
          name="dateAcquisition"
          value={dayjs(logicielData?.dateAcquisition).format("YYYY-MM-DD")}
          type="date"
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Select
          label="Société"
          name="idSociete"
          required
          value={logicielData.idSociete}
          onChange={handleChange}
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          {societes.map((elem) => (
            <MenuItem key={elem.idSociete} value={elem.idSociete}>
              {elem.raisonSociale}
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

export default LogicielModal;
