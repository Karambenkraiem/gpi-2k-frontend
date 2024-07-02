import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FaRegSave } from "react-icons/fa";
import { IoPersonAddOutline } from "react-icons/io5";
import { ip } from "constants/ip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Add, BlockOutlined } from "@mui/icons-material";

const Spécialité = () => {
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
  const [departements, setDepartements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specialitesResponse = await axios.get(ip + "/specialite");
        setSpecialites(specialitesResponse.data);

        const departementsResponse = await axios.get(ip + "/departement");
        setDepartements(departementsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error Fetching Data", error);
      }
    };

    fetchData();
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
      idSpecialite: currentSpecialite.idSpecialite,
    };
    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
    if (hasErrors) {
      console.error("Veuillez remplir tous les champs obligatoires!");
      return;
    }

    if (isEditing) {
      // @ts-ignore
      const { Departement, ...rest } = specialiteToSave;

      axios
        .patch(ip + `/specialite/${specialiteToSave.idSpecialite}`, rest)
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
        .post(ip + "/specialite", specialiteToSave)
        .then((response) => {
          setSpecialites([...specialites, response.data]);
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout de la spécialité", error);
        });
    }
  };

  const handleBlockSpec = (idSpec) => {
    const specialite = specialites.find((s) => s.idSpecialite === idSpec);
    if (!specialite) {
      console.error("Données Introuvables !!!");
      return;
    }
  
    let newStatut;
    switch (specialite.statutSpecialite) {
      case "Actif":
        newStatut = "Suspendu";
        break;
      default:
        newStatut = "Suspendu";
    }
  
    const updatedSpecialite = {
      ...specialite,
      statutSpecialite: newStatut,
    };
  
    const { Departement, ...rest } = updatedSpecialite;
    console.log(newStatut);
  
    axios
      .patch(`${ip}/specialite/${idSpec}`, rest)
      .then((response) => {
        setSpecialites(
          specialites.map((s) => (s.idSpecialite === idSpec ? response.data : s))
        );
      })
      .catch((error) => {
        console.error("Erreur Mise à jour statut spécialité !!! ", error);
      });
  };
  

  // const handleDelete = (id) => {
  //   axios
  //     .delete(ip + `/specialite/${id}`)
  //     .then((response) => {
  //       setSpecialites(
  //         specialites.filter((specialite) => specialite.idSpecialite !== id)
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Erreur Suppression de la spécialité....", error);
  //     });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSpecialite({ ...currentSpecialite, [name]: value });
    validate(name, value);
  };

  const columns = [
    {
      field: "idSpecialite",
      headerName: "Identifiant",
      width: 90,
    },
    {
      field: "idDepartement",
      headerName: "Département",
      width: 200,
    },
    {
      field: "nom",
      headerName: "Designation",
      width: 350,
    },
    {
      field: "statutSpecialite",
      headerName: "Statut",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      width: 300,
      renderCell: (params) => (
        <div>
          <Button
            title="Modifier spécialité"
            onClick={() => handleOpen(params.row)}
            disabled={params.row.statutSpecialite === "Suspendu"}
          >
            <EditNoteIcon />
          </Button>
          <Button
            title="Suspendre Spécialité"
            sx={{  color: "red"}}
            onClick={() => handleBlockSpec(params.row.idSpecialite)}
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
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <div>
      <h1>Gestion des spécialités</h1>
      <Box sx={{ height: 1000, width: "100%" }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Ajouter Spécialité
          </Button>
        </Box>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
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

            <InputLabel htmlFor="departement">Département</InputLabel>
            <Select
              label="Département"
              name="idDepartement"
              required
              value={currentSpecialite.idDepartement}
              onChange={handleChange}
              fullWidth
              // error={!!errors.idSpecialite}
            >
              {departements.map((elem) => (
                <MenuItem key={elem.idDepartement} value={elem.idDepartement}>
                  {elem.nom}
                </MenuItem>
              ))}
            </Select>

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
          // @ts-ignore
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
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default Spécialité;
