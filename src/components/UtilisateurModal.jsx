import React from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { Box, MenuItem, Select } from "@mui/material";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh", // Allows the modal to scroll if content overflows
  overflowY: "auto",
};

const RoleUtilisateur = {
  DIRECTEUR: "Directeur",
  ADMINISTRATEUR: "Administrateur",
  TECHNICIEN: "Technicien",
  EMPLOYE: "Employé",
  RMQ: "RMQ",
};

const EtatUtilisateur = {
  actif: "Actif",
  desactif: "Inactif",
  suspendu: "Suspendu",
};

const UtilisateurModal = ({
  open,
  handleClose,
  isEditing,
  currentUser,
  handleChange,
  handleSave,
  errors,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>{isEditing ? "Edit User" : "Add User"}</h2>

        <TextField
          label="Matricule"
          name="idUtilisateur"
          required
          value={currentUser.idUtilisateur}
          type="number"
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.idUtilisateur}
          helperText={errors.idUtilisateur}
        />

        <TextField
          label="Nom & Prénom"
          required
          name="fullName"
          value={currentUser.fullName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="text"
          error={!!errors.fullName}
          helperText={errors.fullName}
        />

        <TextField
          label="Mot de Passe"
          required
          name="password"
          type="password"
          value={currentUser.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
        />

        <TextField
          label="Email"
          name="email"
          required
          value={currentUser.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="email"
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          label="Specialité"
          name="idSpecialite"
          value={currentUser.idSpecialite}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Select
          label="Role"
          name="roleUtilisateur"
          required
          value={currentUser.roleUtilisateur}
          onChange={handleChange}
          fullWidth
          error={!!errors.roleUtilisateur}
          style={{ marginTop: '1rem' }}
        >
          {Object.values(RoleUtilisateur).map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>

        <Select
          label="Etat"
          name="etatUtilisateur"
          required
          value={currentUser.etatUtilisateur}
          onChange={handleChange}
          fullWidth
          error={!!errors.etatUtilisateur}
          style={{ marginTop: '1rem' }}
        >
          {Object.values(EtatUtilisateur).map((etat) => (
            <MenuItem key={etat} value={etat}>
              {etat}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Telephone Fixe"
          name="telFix"
          value={currentUser.telFix}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="tel"
        />
        <TextField
          label="Telephone Mobile"
          name="telMobile"
          value={currentUser.telMobile}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="tel"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          {isEditing ? <FaRegSave /> : <IoPersonAddOutline />}
          {isEditing ? "_ Enregistrer" : "_ Ajouter"}
        </Button>
      </Box>
    </Modal>
  );
};

export default UtilisateurModal;
