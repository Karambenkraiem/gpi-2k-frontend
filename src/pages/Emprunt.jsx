import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { ip } from "constants/ip";
import { Box } from "@mui/material";

const Emprunt = () => {
  const [emprunts, setEmprunts] = useState([]);

  useEffect(() => {
    // Fetch emprunts from your API
    axios
      .get(ip + "/emprunt") // Adjust the URL to your API endpoint
      .then((response) => {
        const transformedData = response.data.map((item) => ({
          ...item,
          dateEmprunt: item.dateEmprunt
            ? new Date(item.dateEmprunt).toLocaleDateString("fr-FR")
            : "-",
            dateRestitution: item.dateRestitution
            ? new Date(item.dateRestitution).toLocaleDateString("fr-FR")
            : "-",
        }));
        setEmprunts(transformedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the emprunts!", error);
      });
  }, []);
  const rows = emprunts.map((emprunt, index) => ({
    id: index,
    ...emprunt,
    fullName: emprunt?.Utilisateur?.fullName,
    numeroSerie: emprunt?.Materiel?.numeroSerie,
    categorie: emprunt?.Materiel?.categorie,
    marque: emprunt?.Materiel?.marque,
  }));
  const columns = [
    { field: "idUtilisateur", headerName: "Matricule", width: 100 },
    { field: "fullName", headerName: "Nom Employé", width: 150 },
    { field: "numeroSerie", headerName: "Numéro Série", width: 150 },
    { field: "categorie", headerName: "Categorie", width: 150 },
    { field: "marque", headerName: "Marque", width: 120 },
    { field: "dateEmprunt", headerName: "Date Emprunt", width: 150,headerAlign:"center", align:"center", },
    { field: "dateRestitution", headerName: "Date Restitution", width: 150,headerAlign:"center", align:"center", },
    { field: "refProjet", headerName: "Référence Projet", width: 200 },
    {
      field: "etatMatRestitution",
      headerName: "État Matériel Restitution",
      width: 200,
    },
  ];

  // Ensure each row has a unique id

  return (
    <div>
      <h1>Historique des emprunts</h1>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
        slots={{ toolbar: GridToolbar }}
          rows={rows}
          // @ts-ignore
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableRowSelectionOnClick
          // pageSize={10}
          // rowsPerPageOptions={[10]}
        />
      </Box>
    </div>
  );
};

export default Emprunt;
