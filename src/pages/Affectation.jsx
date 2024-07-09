import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { ip } from "constants/ip";
import { Box } from "@mui/material";

const Affectations = () => {
  const [affectations, setAffectations] = useState([]);

  useEffect(() => {
    // Fetch affectations from your API
    axios
      .get(ip + "/affectation")
      .then((response) => {
        const transformedData = response.data.map((item) => ({
          ...item,
          dateAttribution: item.dateAttribution
            ? new Date(item.dateAttribution).toLocaleDateString("fr-FR")
            : "-",
          dateRetour: item.dateRetour
            ? new Date(item.dateRetour).toLocaleDateString("fr-FR")
            : "-",
        }));
        setAffectations(transformedData);
      })
      .catch((error) => {
        console.error("Erreur récupération de données", error);
      });
  }, []);

  const rows = affectations.map((affectation, index) => ({
    id: index,
    ...affectation,
    fullName: affectation?.Utilisateur?.fullName,
    numeroSerie: affectation?.Materiel?.numeroSerie,
    categorie: affectation?.Materiel?.categorie,
    marque: affectation?.Materiel?.marque,
  }));
  const columns = [
    { field: "idUtilisateur", headerName: "ID Utilisateur", width: 150 },
    { field: "fullName", headerName: "Nom Employé", width: 150 },
    { field: "numeroSerie", headerName: "Numéro Série Meteriel", width: 150 },
    { field: "categorie", headerName: "Categorie", width: 150 },
    { field: "marque", headerName: "Marque", width: 150 },
    { field: "dateAttribution", headerName: "Date Attribution",headerAlign:"center",align:"center", width: 200 },
    { field: "dateRetour", headerName: "Date Retour",headerAlign:"center", width: 200,align:"center" },
    { field: "motifRetour", headerName: "Motif Retour", width: 200 },
  ];

  const [loading, setLoading] = useState(true);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <h1>Historique des affectations</h1>
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
        />
      </Box>
    </div>
  );
};

export default Affectations;
