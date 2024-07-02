import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import UtilisateurModal from "../../components/UtilisateurModal";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ip } from "constants/ip";
import NoAccountsOutlinedIcon from "@mui/icons-material/NoAccountsOutlined";
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";
import { Add } from "@mui/icons-material";


const Utilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleClose = () => setOpen(false);
  const [currentUser, setCurrentUser] = useState({
    idUtilisateur: "",
    password: "",
    fullName: "",
    email: "",
    idSpecialite: "",
    roleUtilisateur: "",
    etatUtilisateur: "",
    telFix: "",
    telMobile: "",
  });

  useEffect(() => {
    axios
      .get(ip + "/utilisateur")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data", error);
      });
  }, []);

  const validate = (name, value) => {
    let errorMsg = "";
    if (name === "idUtilisateur" && !value) {
      errorMsg = "Matricule est obligatoire !!!";
    } else if (name === "fullName" && !value) {
      errorMsg = "Nom & Prénom est obligatoire";
    } else if (name === "password" && !value) {
      errorMsg = "Mot de Passe est obligatoire";
    } else if (name === "email" && (!value || !/\S+@\S+\.\S+/.test(value))) {
      errorMsg = "Email n'est pas valide";
    } else if (name === "idSpecialite" && !value) {
      errorMsg = "Specialité est obligatoire";
    } else if (name === "roleUtilisateur" && !value) {
      errorMsg = "Role est obligatoire";
    } else if (name === "etatUtilisateur" && !value) {
      errorMsg = "Etat est obligatoire";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };
  ///////////////////////////////////////////////

  const handleOpen = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setIsEditing(true);
    } else {
      setCurrentUser({
        idUtilisateur: "",
        password: "",
        fullName: "",
        email: "",
        idSpecialite: "",
        roleUtilisateur: "",
        etatUtilisateur: "",
        telFix: "",
        telMobile: "",
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleSave = () => {
    const userToSave = {
      ...currentUser,
      idUtilisateur: parseInt(currentUser.idUtilisateur, 10),
    };
    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg);
    if (hasErrors) {
      console.error("Veuillez remplir tous les champs obligatoires!");
      return;
    }

    if (isEditing) {
      // @ts-ignore
      const { Specialite, ...rest } = userToSave;
      axios
        .patch(ip + `/utilisateur/${userToSave.idUtilisateur}`, rest)
        .then((response) => {
          setUsers(
            users.map((user) =>
              user.idUtilisateur === userToSave.idUtilisateur
                ? response.data
                : user
            )
          );
          handleClose();
        })
        .catch((error) => {
          console.error("Problème modification Utilisateur", error);
        });
    } else {
      axios
        .post(ip + "/utilisateur", userToSave)
        .then((response) => {
          setUsers([...users, response.data]);
          handleClose();
        })
        .catch((error) => {
          console.error("Erreur ajout de utilisateur", error);
        });
    }
  };

  // const handleDelete = (id) => {
  //   axios
  //     .delete(ip + `/utilisateur/${id}`)
  //     .then((response) => {
  //       setUsers(users.filter((user) => user.idUtilisateur !== id));
  //     })
  //     .catch((error) => {
  //       console.error("Erreur Suppression de utilisateur....", error);
  //     });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
    validate(name, value);
  };


  const handleBlockUser = (userId) => {
    const user = users.find((u) => u.idUtilisateur === userId);
    if (!user) {
      console.error("Données Introuvable !!!");
      return;
    }
  
    let newStatus;
    switch (user.etatUtilisateur) {
      case "actif":
        newStatus = "suspendu";
        break;
      case "inactif":
        newStatus = "suspendu";
        break;
      case "suspendu":
       
        break;
      default:
        newStatus = "actif";
    }  
    const updatedUser = {
      ...user,
      etatUtilisateur: newStatus,
    };
    axios
      .patch(ip + `/utilisateur/${userId}`, updatedUser)
      .then((response) => {
        setUsers(
          users.map((u) => (u.idUtilisateur === userId ? response.data : u))
        );
      })
      .catch((error) => {
        console.error("Erreur Mise à jour état utilisateur !!! ", error);
      });
  };  

  const toggleStatus = (userId) => {
    const user = users.find((u) => u.idUtilisateur === userId);
    if (!user) {
      console.error("Données Introuvable !!!");
      return;
    }

    let newStatus;
    switch (user.etatUtilisateur) {
      case "actif":
        newStatus = "inactif";
        break;
      case "inactif":
        newStatus = "actif";
        break;     
      default:
        newStatus = "actif";
    }
    const updatedUser = {
      ...user,
      etatUtilisateur: newStatus,
    };
    axios
      .patch(ip + `/utilisateur/${userId}`, updatedUser)
      .then((response) => {
        setUsers(
          users.map((u) => (u.idUtilisateur === userId ? response.data : u))
        );
      })
      .catch((error) => {
        console.error("Erreur Mise à jours etat utilisateur !!! ", error);
      });
  };

  const handleView = (id) => {
    Navigate(`/utilisateur/${id}`);
  };

  const columns = [
    {
      field: "idUtilisateur",
      headerName: "Matricule",
      width: 150,
    },
    {
      field: "fullName",
      headerName: "Nom & Prénom",
      width: 210,
    },
    {
      field: "roleUtilisateur",
      headerName: "Role",
      width: 160,
    },
    {
      field: "etatUtilisateur",
      headerName: "Etat",
      width: 160,
    },
    {
      field: "idSpecialite",
      headerName: "Spécialité",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 300,
      renderCell: (params) => (
        <div>
          <Button
            title="Visualiser Utilisateur"
            onClick={() => handleView(params.row.idUtilisateur)}
          >
            <VisibilityOutlinedIcon />
          </Button>
          <Button
            title="Modifier Utilisateur"
            onClick={() => handleOpen(params.row)}
            disabled={ params.row.etatUtilisateur === "suspendu"}

          >
            <EditNoteIcon />
          </Button>
          <Button
            title="Activer / Desactiver Utilisateur"
            onClick={() => toggleStatus(params.row.idUtilisateur)}
            disabled={ params.row.etatUtilisateur === "suspendu"}
          >
            <LockPersonOutlinedIcon />
          </Button>
          <Button onClick={()=>handleBlockUser(params.row.idUtilisateur)} title="Suspendre le compte">
            <NoAccountsOutlinedIcon sx={{ color: "red" }} />
          </Button>
        </div>
      ),
    },
  ];
  const [pageSize, setPageSize] = useState(25);
  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      <Box sx={{ height: 560, width: "100%" }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen(null)}
            startIcon={<Add />}

          >
            Ajouter Utilisateur
          </Button>
        </Box>
        <UtilisateurModal
          open={open}
          handleClose={() => setOpen(false)}
          isEditing={isEditing}
          currentUser={currentUser}
          handleChange={handleChange}
          handleSave={handleSave}
          errors={errors}
        />
      <Box sx={{ height: 1000, width: "100%" }}>

        <DataGrid
          rows={users}
          // @ts-ignore
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          pagination
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          // @ts-ignore
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          getRowId={(row) => row.idUtilisateur}
        />
        </Box>
      </Box>
    </div>
  );
};

export default Utilisateurs;
