import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField, MenuItem } from "@mui/material";
import axios from "axios";

const MaterielPage = () => {
  // Define the Categorie enum
  const Categorie = {
    UniteCentrale: "UniteCentrale",
    Ecran: "Ecran",
    PcPortable: "PcPortable",
    Imprimante: "Imprimante",
    Scanner: "Scanner",
    Onduleur: "Onduleur",
    VideoProjecteur: "VideoProjecteur",
    Serveur: "Serveur",
    Switch: "Switch",
  };

  const EtatMateriel = {};

  const [materiels, setMateriels] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMateriels();
  }, []);

  const fetchMateriels = () => {
    axios
      .get("http://localhost:3000/materiel")
      .then((response) => {
        const rowsWithIds = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));
        setMateriels(rowsWithIds);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setFormData({});
    setIsEditing(false);
  };

  const handleSave = () => {
    if (isEditing) {
      axios
        .put(`http://localhost:3000/materiel/${formData.id}`, formData)
        .then(() => {
          fetchMateriels();
          handleCloseModal();
        })
        .catch((error) => console.error("Error updating data:", error));
    } else {
      axios
        .post("http://localhost:3000/materiel", formData)
        .then(() => {
          fetchMateriels();
          handleCloseModal();
        })
        .catch((error) => console.error("Error adding data:", error));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (rowData) => {
    setFormData(rowData);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (rowData) => {
    axios
      .delete(`http://localhost:3000/materiel/${rowData.id}`)
      .then(() => {
        fetchMateriels();
      })
      .catch((error) => console.error("Error deleting data:", error));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "numeroSerie", headerName: "Numero Serie", width: 150 },
    { field: "categorie", headerName: "Categorie", width: 150 },
    { field: "marque", headerName: "Marque", width: 150 },
    { field: "modele", headerName: "Modele", width: 150 },
    { field: "prix", headerName: "Prix", type: "number", width: 110 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <h1>Materiel Page</h1>
      <Button onClick={handleOpenModal} variant="contained" color="primary">
        Add Materiel
      </Button>
      <DataGrid
        rows={materiels}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        onRowDoubleClick={handleEdit}
      />

      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>{isEditing ? "Edit Materiel" : "Add Materiel"}</h2>

          <TextField
            select
            label="Categorie"
            name="categorie"
            value={formData.categorie || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {Object.values(Categorie).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Numero de Série"
            name="numeroSerie"
            value={formData.numeroSerie || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Marque"
            name="marque"
            value={formData.marque || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Modèle"
            name="modele"
            value={formData.modele || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prix"
            name="prix"
            value={formData.prix || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Garantie"
            name="garantie"
            value={formData.prix || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Garantie"
            name="garantie"
            value={formData.prix || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Etat Materiel"
            name="etatMateriel"
            value={formData.etatMateriel || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {["nouveau", "fonctionnel", "enPanne", "rebut"].map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          {formData.categorie === Categorie.UniteCentrale && (
            <TextField
              label="Marque"
              name="marque"
              value={formData.marque || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )}

          {formData.categorie === Categorie.Ecran && (
            <TextField
              label="Taille de l'écran"
              name="tailleEcran"
              value={formData.tailleEcran || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )}

          {/* Ajoutez d'autres champs pour les autres catégories ici */}

          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MaterielPage;
