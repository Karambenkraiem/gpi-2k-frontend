// import { CircularProgress, Typography } from "@mui/material";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function Utilisateur() {

//   const { idUtilisateur } = useParams();
//   const [user, setUser] = useState(null);
//  const [state, setState] = useState(); // Removed as it is not used
//   const [loading, setLoading] = useState(true);
 
//   useEffect(() => {
//     console.log(`Recuperation de donnée de l'utilisateur avec le id: ${idUtilisateur}`);
//     axios.get(`http://localhost:3000/utilisateur/${idUtilisateur}`)
//     .then((res) => {
//       console.log('API response:', res.data);

//       setUser(res.data);
//       setLoading(false);
//     })
//     .catch(error => {
//       console.error('Error recuperation donnée utilisateur !!!', error);
//       setLoading(false);
//     });
//   }, [idUtilisateur]); // Updated dependencies to include idUtilisateur
  
//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (!user) {
//     return <Typography variant="h6">User not found.</Typography>;
//   }
  
//   return (
//     <div>{user.fullName}</div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const UserDetails = () => {
  const { idUtilisateur } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/utilisateur/${idUtilisateur}`)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, [idUtilisateur]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!user) {
    return <Typography variant="h6">User not found.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>User Details</Typography>
      <Typography variant="body1"><strong>Matricule:</strong> {user.idUtilisateur}</Typography>
      <Typography variant="body1"><strong>Nom & Prénom:</strong> {user.fullName}</Typography>
      <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
      <Typography variant="body1"><strong>Role:</strong> {user.roleUtilisateur}</Typography>
      <Typography variant="body1"><strong>Etat:</strong> {user.etatUtilisateur}</Typography>
      <Typography variant="body1"><strong>Specialité:</strong> {user.idSpecialite}</Typography>
      <Typography variant="body1"><strong>Tel Fix:</strong> {user.telFix}</Typography>
      <Typography variant="body1"><strong>Tel Mobile:</strong> {user.telMobile}</Typography>
      <Typography variant="body1"><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</Typography>
      <Typography variant="body1"><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</Typography>
    </Box>
  );
};

export default UserDetails;
