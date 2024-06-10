import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import {LuClipboardEdit} from 'react-icons/lu';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {VscActivateBreakpoints} from 'react-icons/vsc';
import {TbEyeSearch} from 'react-icons/tb';
import {FaRegSave} from 'react-icons/fa';
import {IoPersonAddOutline} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import UtilisateurModal from '../../components/UtilisateurModal'

const Utilisateurs = () => {
  const [users, setUsers] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [open, setOpen] = useState (false);
  const [isEditing, setIsEditing] = useState (false);
  const [currentUser, setCurrentUser] = useState ({
    idUtilisateur: '',
    password: '',
    fullName: '',
    email: '',
    idSpecialite: '',
    roleUtilisateur: '',
    etatUtilisateur: '',
    telFix: '',
    telMobile: '',
  });
  const [errors, setErrors] = useState ({});
  const Navigate = useNavigate();

  useEffect (() => {
    axios
      .get ('http://localhost:3000/utilisateur')
      .then (response => {
        setUsers (response.data);
        setLoading (false);
      })
      .catch (error => {
        console.error ('Error Fetching Data', error);
      });
  }, []);

  const validate = (name, value) => {
    let errorMsg = '';
    if (name === 'idUtilisateur' && !value) {
      errorMsg = 'Matricule est obligatoire !!!';
    } else if (name === 'fullName' && !value) {
      errorMsg = 'Nom & Prénom est obligatoire';
    } else if (name === 'password' && !value) {
      errorMsg = 'Mot de Passe est obligatoire';
    } else if (name === 'email' && (!value || !/\S+@\S+\.\S+/.test (value))) {
      errorMsg = "Email n'est pas valide";
    } else if (name === 'idSpecialite' && !value) {
      errorMsg = 'Specialité est obligatoire';
    } else if (name === 'roleUtilisateur' && !value) {
      errorMsg = 'Role est obligatoire';
    } else if (name === 'etatUtilisateur' && !value) {
      errorMsg = 'Etat est obligatoire';
    }
    setErrors (prevErrors => ({...prevErrors, [name]: errorMsg}));
  };

  const handleOpen = (user = null) => {
    if (user) {
      setCurrentUser (user);
      setIsEditing (true);
    } else {
      setCurrentUser ({
        idUtilisateur: '',
        password: '',
        fullName: '',
        email: '',
        idSpecialite: '',
        roleUtilisateur: '',
        etatUtilisateur: '',
        telFix: '',
        telMobile: '',
      });
      setIsEditing (false);
    }
    setOpen (true);
  };

  const handleClose = () => setOpen (false);

  const handleSave = () => {
    const userToSave = {
      ...currentUser,
      idUtilisateur: parseInt (currentUser.idUtilisateur, 10),
    };

    const hasErrors = Object.values (errors).some (errorMsg => errorMsg);
    if (hasErrors) {
      console.error (
        'Il y  a des champs obligatoire veuillez les remplir SVP !!!'
      );
      return;
    }

    if (isEditing) {
      axios
        .patch (
          `http://localhost:3000/utilisateur/${userToSave.idUtilisateur}`,
          userToSave
        )
        .then (response => {
          setUsers (
            users.map (
              user =>
                user.idUtilisateur === userToSave.idUtilisateur
                  ? response.data
                  : user
            )
          );
          handleClose ();
        })
        .catch (error => {
          console.error ('Problème modification Utilisateur', error);
        });
    } else {
      axios
        .post ('http://localhost:3000/utilisateur', userToSave)
        .then (response => {
          setUsers ([...users, response.data]);
          handleClose ();
        })
        .catch (error => {
          console.error ('Erreur ajout de utilisateur', error);
        });
    }
  };

  const handleDelete = id => {
    axios
      .delete (`http://localhost:3000/utilisateur/${id}`)
      .then (response => {
        setUsers (users.filter (user => user.idUtilisateur !== id));
      })
      .catch (error => {
        console.error ('Erreur Suppression de utilisateur....', error);
      });
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setCurrentUser ({...currentUser, [name]: value});
    validate (name, value);
  };
  
  
  
  const handleView = id =>{
    Navigate(`/utilisateur/${id}`);
  };

  const columns = [
    {field: 'idUtilisateur', headerName: 'Matricule', width: 90},
    {field: 'fullName', headerName: 'Nom & Prénom', width: 150},
    {field: 'roleUtilisateur', headerName: 'Role', width: 150},
    {field: 'etatUtilisateur', headerName: 'Etat', width: 150},
    {field: 'idSpecialite', headerName: 'Spécialité', width: 150},
    // { field: 'departement', headerName: 'Departement', width: 150, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: params => (
        <div>
          <Button onClick={() => handleOpen (params.row)}>
            <LuClipboardEdit />
          </Button>
          
          
          <Button><VscActivateBreakpoints /></Button>
          
          
          <Button onClick={()=>handleView(params.row.idUtilisateur)}> <TbEyeSearch /></Button>
          <Button onClick={() => handleDelete (params.row.idUtilisateur)}>
            <RiDeleteBin6Line />
          </Button>

        </div>
      ),
    },
  ];

  return (
    <Box sx={{height: 400, width: '100%'}}>
      <Button variant="contained" color="primary" onClick={() => handleOpen ()}>
        + Ajouter Utilisateur
      </Button>

      <UtilisateurModal
        open={open}
        handleClose={() => setOpen(false)}
        isEditing={isEditing}
        currentUser={currentUser}
        handleChange={handleChange}
        handleSave={handleSave}
        errors={errors}
      />

      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        getRowId={row => row.idUtilisateur}
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

export default Utilisateurs;
