import React, { useContext, useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { ip } from "constants/ip";
import { UserContext } from "router/Router";

const UtilisateurModal = ({
  isProfile,
  open,
  handleClose,
  isEditing,
  currentUser,
  handleChange,
  handleSave,
  errors,
}) => {
  const [specialites, setSpecialities] = useState([]);
  const { user } = useContext(UserContext);
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

  const RoleUtilisateur = {
    DIRECTEUR: "DIRECTEUR",
    ADMINISTRATEUR: "ADMINISTRATEUR",
    TECHNICIEN: "TECHNICIEN",
    EMPLOYE: "EMPLOYE",
    RMQ: "RMQ",
  };

  const EtatUtilisateur = {
    actif: "actif",
    desactif: "inactif",
    suspendu: "suspendu",
  };

  useEffect(() => {
    axios.get(ip + "/specialite").then((res) => setSpecialities(res.data));
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>{isEditing ? "Modifier Utilisateur" : "Ajouter Utilisateur"}</h2>

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
          disabled={isEditing}
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
        {!isEditing && (
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
        )}

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
        {["ADMINISTRATEUR"].includes(user.roleUtilisateur) && !isProfile ? (
          <>
            <InputLabel htmlFor="specialite">Spécialité</InputLabel>

            <Select
              label="Spécialité"
              name="idSpecialite"
              required
              value={currentUser.idSpecialite}
              onChange={handleChange}
              fullWidth
              error={!!errors.idSpecialite}
              style={{ marginTop: "1rem" }}
            >
              {specialites.map((elem) => (
                <MenuItem key={elem.idSpecialite} value={elem.idSpecialite}>
                  {elem.nom}
                </MenuItem>
              ))}
            </Select>
            {currentUser.roleUtilisateur !== "ADMINISTRATEUR" && (
              <>
                <InputLabel htmlFor="roleUtilisateur">Role</InputLabel>

                <Select
                  label="Role"
                  name="roleUtilisateur"
                  required
                  value={currentUser.roleUtilisateur}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.roleUtilisateur}
                  style={{ marginTop: "1rem" }}
                >
                  {Object.values(RoleUtilisateur).map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </>
        ) : null}

        {!isEditing && (
          <>
            <InputLabel htmlFor="etatUtilisateur">Etat</InputLabel>

            <Select
              label="Etat"
              name="etatUtilisateur"
              required
              value={currentUser.etatUtilisateur}
              onChange={handleChange}
              fullWidth
              error={!!errors.etatUtilisateur}
              style={{ marginTop: "1rem" }}
              disabled={currentUser.etatUtilisateur === "suspendu"}
            >
              {Object.values(EtatUtilisateur).map((etat) => (
                <MenuItem key={etat} value={etat}>
                  {etat}
                </MenuItem>
              ))}
            </Select>
          </>
        )}

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

export default UtilisateurModal;
