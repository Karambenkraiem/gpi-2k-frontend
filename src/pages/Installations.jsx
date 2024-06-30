import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import axios from "axios";
import { ip } from "constants/ip";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";

function Installations() {
  const [installations, setInstallations] = useState([]);

  useEffect(() => {
    axios
      .get(ip + "/installation")
      .then((response) => {
        setInstallations(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the alimentations!", error);
      });
  }, []);

  const rowsInstallations = installations.map((installation, index) => ({
    id: index,
    ...installation,
    numeroLicence: installation.numeroLicence || "N/A",
    statutLicence: installation.statutLicence || "N/A",
  }));
  

  const columns = [
    { field: "idInstallation", headerName: "ID", width: 90 },
    { field: "idLicence", headerName: "ID licence", width: 150 },
    { field: "numeroLicence", headerName: "N° licence", width: 150 },
    { field: "numeroSerie", headerName: "Numero Série Materiel", width: 150 },
    {
      field: "dateInstallation",
      headerName: "Date d'installation",
      width: 200,
    },
    {
      field: "dayeDesinstallation",
      headerName: "Date de désinstallation",
      width: 150,
    },
    { field: "statutLicence", headerName: "Statut", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          color="primary" // Use primary color
          style={{ marginBottom: 16 }}
        >
          <ReplyAllIcon /> RETOUR
        </Button>
      ),
    },
  ];
  const navigate = useNavigate();

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rowsInstallations}
        columns={columns}
        // @ts-ignore
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.idConsommation}
      />
    </div>
  );
}

export default Installations;
