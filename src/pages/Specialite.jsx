import { useState, useEffect } from "react";
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

const Specialite = () => {
  const [errors, setErrors] = useState({});
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleClose = () => setOpen(false);
  const [currentSpecialite, setCurrentSpecialite] = useState({
    idSpecialite: "",
    nom: "",
    idDepartement: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/specialite")
      .then((response) => {
        setSpecialites(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data", error);
      });
  }, []);

  const validate = (name, value) => {
    let errorMsg = "";
    if (name === "idSpecialite" && !value) {
      errorMsg = "L'identifiant de la spécialité est obligatoire!";
    } else if (name === "nom" && !value) {
      errorMsg = "Nom de la spécialité est obligatoire";
    } else if (name === "département" && !value) {
      errorMsg = "Le département est obligatoire";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const handleOpen = (specialite = null) => {
    if (specialite) {
      setCurrentSpecialite(specialite);
      setIsEditing(true);
    } else {
      setCurrentSpecialite({
        idSpecialite: "",
        nom: "",
        idDepartement: "",
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleSave = () => {
    const specialiteToSave = {
      ...currentSpecialite,
      idUtilisateur: parseInt(currentSpecialite.idSpecialite, 10),
    };
    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
    if (hasErrors) {
      console.error("Veuillez remplir tous les champs obligatoires!");
      return;
    }

    if (isEditing) {
      const { Departement, ...rest } = specialiteToSave;
      //delete userToSave.Specialite;
      axios
        .patch(
          `http://localhost:3000/specialite/${specialiteToSave.idSpecialite}`,
          rest
        )
        .then((response) => {
          setSpecialites(
            specialites.map((specialite) =>
              specialite.idSpecialite === specialiteToSave.idSpecialite
                ? response.data
                : specialite
            )
          );
          handleClose();
        })
        .catch((error) => {
          console.error("Problème modification de la spécialité", error);
        });
    } else {
      axios
        .post("http://localhost:3000/specialite", specialiteToSave)
        .then((response) => {
          setSpecialites([...specialites, response.data]);
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout de la spécialité", error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/specialite/${id}`)
      .then((response) => {
        setSpecialites(
          specialites.filter((specialite) => specialite.idSpecialite !== id)
        );
      })
      .catch((error) => {
        console.error("Erreur Suppression de la spécialité....", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSpecialite({ ...currentSpecialite, [name]: value });
    validate(name, value);
  };

  const columns = [
    {
      field: "idSpecialite",
      headerName: "#ID",
      width: 90,
      headerAlign: "center",
    },
    {
      field: "nom",
      headerName: "Designation",
      width: 300,
      headerAlign: "center",
    },
    {
      field: "idDepartement",
      headerName: "Département",
      width: 150,
      headerAlign: "center",
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
          <Button onClick={() => handleDelete(params.row.idSpecialite)}>
            <RiDeleteBin6Line />
          </Button>
        </div>
      ),
    },
  ];
  

  return (
    <Box sx={{ height: 560, width: "100%" }}>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        + Ajouter Spécialité
      </Button>
      <Modal open={open} onClose={handleClose}>
        {/*<Box sx={Style}>*/}
        <Box>
          <h2>{isEditing ? "Modifier Spécialité" : "Ajouter Spécialité"}</h2>

          <TextField
            label="Identifiant Spécialité"
            name="idSpecialite"
            required
            value={currentSpecialite.idSpecialite}
            type="text"
            onChange={handleChange}
            fullWidth
            margin="normal"
            //   error={!!errors.idSpecialite}
            //   helperText={errors.idSpecialite}
            disabled={isEditing ? true : false}
          />

          <TextField
            label="Désignation"
            required
            name="nom"
            value={currentSpecialite.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="text"
            //   error={!!errors.nom}
            //   helperText={errors.nom}
          />

          <TextField
            label="Département"
            required
            name="idDepartement"
            type="text"
            value={currentSpecialite.idDepartement}
            onChange={handleChange}
            fullWidth
            margin="normal"
            //   error={!!errors.password}
            //   helperText={errors.password}
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
        rows={specialites}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.idSpecialite}
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
  );
};

export default Specialite;
