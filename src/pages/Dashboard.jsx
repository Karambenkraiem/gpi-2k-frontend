// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import logoTECI from '../assets/logoTECI.jpg';
import axios from "axios";
import {
  CircularProgress,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ip } from "constants/ip";
import { deepPurple, lightBlue, pink, green } from "@mui/material/colors";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${ip}/dashboard`)
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching dashboard data", error));
  }, []);

  if (!data)
    return (
      <Box
        display="flex"
        flexDirection="column"

        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  const pieData = [
    { name: "Utilisateurs", value: data.userCount },
    { name: "Matériels", value: data.materialCount },
  ];

  const barData = [
    { name: "Utilisateurs", count: data.userCount },
    { name: "Matériels", count: data.materialCount },
  ];

  const COLORS = [lightBlue[400], pink[400]];

  return (
             <div>

             
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: deepPurple[500], mr: 2 }}>
                  {data.adminName[0]}
                </Avatar>
                <Typography variant="h6">
                  Administrateur: {data.adminName}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
            <img src={logoTECI} alt="Logo_TECI" style={{ maxWidth: '100%' }} />
            </CardContent>
          </Card>
          
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nombre d'Utilisateurs et de Matériels
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nombre d'Utilisateurs et de Matériels
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={green[500]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export default Dashboard;
