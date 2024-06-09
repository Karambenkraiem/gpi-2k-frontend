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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh', // Allows the modal to scroll if content overflows
  overflowY: 'auto',
};

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
    roleUtilisateur: '',
    etatUtilisateur: '',
    telFix: '',
    telMobile: '',
    idSpecialite: '',
  });

  useEffect (() => {
    axios
      .get ('http://localhost:3000/utilisateur')
      .then (response => {
        setUsers (response.data);
        setLoading (false);
      })
      .catch (error => {
        console.error ('There was an error fetching the data!', error);
      });
  }, []);

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
        roleUtilisateur: '',
        etatUtilisateur: '',
        telFix: '',
        telMobile: '',
        idSpecialite: '',
      });
      setIsEditing (false);
    }
    setOpen (true);
  };

  const handleClose = () => setOpen (false);

  const handleSave = () => {
    const userToSave = {
      ...currentUser,
      idUtilisateur: parseInt (currentUser.idUtilisateur, 10), // Convert idUtilisateur to integer
    };

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
          console.error ('There was an error updating the user!', error);
        });
    } else {
      axios
        .post ('http://localhost:3000/utilisateur', userToSave)
        .then (response => {
          setUsers ([...users, response.data]);
          handleClose ();
        })
        .catch (error => {
          console.error ('There was an error adding the user!', error);
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
        console.error ('There was an error deleting the user!', error);
      });
  };

  const handleChange = e => {
    setCurrentUser ({...currentUser, [e.target.name]: e.target.value});
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
          <Button> <TbEyeSearch /></Button>
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
        Ajouter Utilisateur
      </Button>
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
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h2>{isEditing ? 'Edit User' : 'Add User'}</h2>
          <TextField
            label="Matricule"
            name="Matricule"
            required
            value={currentUser.idUtilisateur}
            type="number"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nom & Prénom"
            required
            name="Nom & Prénom"
            value={currentUser.fullName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="text"
          />
          <TextField
            label="Mot de Passe"
            required
            name="Mot de Passe"
            type="password"
            value={currentUser.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
          />
          <TextField
            label="Specialite"
            required
            name="idSpecialite"
            value={currentUser.idSpecialite}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Role"
            name="roleUtilisateur"
            required
            value={currentUser.roleUtilisateur}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Etat"
            required
            name="etatUtilisateur"
            value={currentUser.etatUtilisateur}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
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
          
          <Button onClick={handleSave}>
            {isEditing ? <FaRegSave /> : <IoPersonAddOutline />}{isEditing ? '_ Enregistrer' : '_ Ajouter'}
            
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Utilisateurs;
