import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { ip } from "constants/ip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Add, BlockOutlined } from "@mui/icons-material";

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

  const fetchDepartement = () => {
    axios
      .get(ip + "/departement")
      .then((response) => {
        setDepartements(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data", error);
      });
  };
  useEffect(() => {
    fetchDepartement();
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
    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
    if (hasErrors) {
      console.error("Veuillez remplir tous les champs obligatoires!");
      return;
    }

    if (isEditing) {
      axios
        .patch(ip + `/departement/${currentDepartement.idDepartement}`, {
          nom: currentDepartement.nom,
        })
        .then((response) => {
          setDepartements(response.data);
          fetchDepartement();
          handleClose();
        })
        .catch((error) => {
          console.error("Problème modification du département", error);
        });
    } else {
      axios
        .post(ip + "/departement", currentDepartement)
        .then((response) => {
          setDepartements([...departements, response.data]);
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout du département", error);
        });
    }
  };


  const handleBlockDep = (idDep) => {
    const departement = departements.find((d) => d.idDepartement === idDep);
    if (!departement) {
      console.error("Données Introuvable !!!");
      return;
    }
  
    let newStatus;
    switch (departement.statutDepartement) {
      case "Actif":
        newStatus = "Suspendu";
        break;      
      
    }  
    const updatedDepartement = {
      ...departement,
      statutDepartement: newStatus,
    };
    axios
      .patch(ip + `/departement/${idDep}`, updatedDepartement)
      .then((response) => {
        setDepartements(
          departements.map((d) => (d.idDepartement === idDep ? response.data : d))
        );
      })
      .catch((error) => {
        console.error("Erreur Mise à jour statut Departement !!! ", error);
      });
  };







  // const handleDelete = (id) => {
  //   axios
  //     .delete(ip + `/departement/${id}`)
  //     .then((response) => {
  //       setDepartements(
  //         departements.filter((specialite) => specialite.idDepartement !== id)
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Erreur Suppression du département!", error);
  //     });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartement({ ...currentDepartement, [name]: value });
    validate(name, value);
  };

  const columns = [
    {
      field: "idDepartement",
      headerName: "Identifiant",
      width: 90,
    },
    {
      field: "nom",
      headerName: "Designation",
      width: 500,
    },
    {
      field: "statutDepartement",
      headerName: "Statut",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "right",
      align: "right",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            title="Modifier département"
            onClick={() => handleOpen(params.row)}
            disabled={params.row.statutDepartement==="Suspendu"}

          >
            <EditNoteIcon />
          </Button>
          <Button
            title="Suspendre département"
            sx={{  color: "red"}}
            onClick={() => handleBlockDep(params.row.idDepartement)}
          >
            <BlockOutlined sx={{ color: "red" }} />
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
    <div style={{margin:15}}>
      <h1>Gestion des départements</h1>
      <Box sx={{ height: 560, width: "100%" }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Ajouter département
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

        <Box sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={departements}
            // @ts-ignore
            columns={columns}
            loading={loading}
            getRowId={(row) => row.idDepartement}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
            }}
            pageSizeOptions={[5,10,25, 50, 100]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </div>
  );
};

export default Département;
