import { Button, Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddIcon from "@mui/icons-material/Add";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { ip } from "constants/ip";
import axios from "axios";

const IncidentUtilisateur = () => {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const demandeurId = 448;
  // const [demandeurId, setDemandeurId] = useState();
  // setDemandeurId('616');
  
  const fetchReclamationsEnCours = () =>{
    axios
    .get(`${ip}/incident/encours/incidents/${demandeurId}`)
    .then((response)=>{
      setIncidents(response.data);
      setLoading(false);
    })
    .catch((error)=>console.error("Erreur de chargement de données!"))
  }

  useEffect(() =>{
    fetchReclamationsEnCours();
  }, []);
  
  const handleView = () => {}
  
  const handleEdit = () => {}
  const handleOpen = () => {}

  const columns = [
    { field: "idIncident", headerName: "N° Réclamation", width: 150 },
    { field: "etatReclamation", headerName: "Statut réclamation", width: 200 },
    { field: "reclamation", headerName: "Réclamation", width: 400 },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      width: 300,
      renderCell: (params) => (
        <div text-align="left">
          <Button
            title="Voir détails logiciel"
            onClick={null}
          >
            <VisibilityOutlinedIcon />
          </Button>
          <Button
            title="Modifier logiciel"
            onClick={null}
          >
            <EditNoteIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Suivi des réclamations</h1>
      <Box sx={{ height: 500, width: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={null}
          >
            Réclamer un incident
          </Button>
          <Box display="flex" gap={2}>
            <Button
              // variant="contained"
              color="primary"
              startIcon={<HistoryOutlinedIcon />}
              onClick={null}
              style={{ color: "red" }}
            >
              Historiques de mes réclamations
            </Button>
          </Box>
        </Box>

        <DataGrid
          rows={incidents}
          // @ts-ignore
          columns={columns}
          loading={loading}
          getRowId={(row) => row.idIncident}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
  
}

export default IncidentUtilisateur