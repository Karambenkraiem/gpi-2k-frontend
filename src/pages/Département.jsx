import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import { LuClipboardEdit } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";

const Département = () => {
  const [errors, setErrors] = useState({});
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleClose = () => setOpen(false);
  const [currentDepartement, setCurrentDepartement] = useState({
    idDepartement: "",
    nom: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/departement")
      .then((response) => {
        setDepartements(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data", error);
      });
  }, []);

  const validate = (name, value) => {
    let errorMsg = "";
    if (name === "idDepartement" && !value) {
      errorMsg = "L'identifiant du département est obligatoire!";
    } else if (name === "nom" && !value) {
      errorMsg = "Nom du département est obligatoire";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const handleOpen = (departement = null) => {
    if (departement) {
      setCurrentDepartement(departement);
      setIsEditing(true);
    } else {
      setCurrentDepartement({
        idDepartement: "",
        nom: "",
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleSave = () => {
    const departementToSave = {
      ...currentDepartement,
      idDepartement: currentDepartement.idDepartement,
    };
    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
    if (hasErrors) {
      console.error("Veuillez remplir tous les champs obligatoires!");
      return;
    }

    if (isEditing) {
      axios
        .patch(
          `http://localhost:3000/departement/${departementToSave.idDepartement}`
        )
        .then((response) => {
          setDepartements(
            departements.map((departement) =>
              departement.idDepartement === departementToSave.idDepartement
                ? response.data
                : departement
            )
          );
          handleClose();
        })
        .catch((error) => {
          console.error("Problème modification du département", error);
        });
    } else {
      axios
        .post("http://localhost:3000/departement", departementToSave)
        .then((response) => {
          setDepartements([...departements, response.data]);
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout du département", error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/departement/${id}`)
      .then((response) => {
        setDepartements(
          departements.filter((specialite) => specialite.idDepartement !== id)
        );
      })
      .catch((error) => {
        console.error("Erreur Suppression du département!", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartement({ ...currentDepartement, [name]: value });
    validate(name, value);
  };

  const columns = [
    {
      field: "idDepartement",
      headerName: "#ID",
      width: 90,
    },
    {
      field: "nom",
      headerName: "Designation",
      width: 300,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleOpen(params.row)}>
            <LuClipboardEdit />
          </Button>
          <Button onClick={() => handleDelete(params.row.idDepartement)}>
            <RiDeleteBin6Line />
          </Button>
        </div>
      ),
    },
  ];

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

  return (
    <div>
      <h1>Gestion des départements</h1>
      <Box sx={{ height: 560, width: "100%" }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            + Ajouter département
          </Button>
        </Box>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <h2>
              {isEditing ? "Modifier département" : "Ajouter département"}
            </h2>

            <TextField
              label="Identifiant département"
              name="idDepartement"
              required
              value={currentDepartement.idDepartement}
              type="text"
              onChange={handleChange}
              fullWidth
              margin="normal"
              //   error={!!errors.idDepartement}
              //   helperText={errors.idDepartement}
              disabled={isEditing ? true : false}
            />

            <TextField
              label="Désignation"
              required
              name="nom"
              value={currentDepartement.nom}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="text"
              //   error={!!errors.nom}
              //   helperText={errors.nom}
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
        <DataGrid
          rows={departements}
          // @ts-ignore
          columns={columns}
          loading={loading}
          getRowId={(row) => row.idDepartement}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default Département;
