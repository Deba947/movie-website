import React, { useState } from "react";
import { Container, Box, Button } from "@mui/material";
import { Movie, People } from "@mui/icons-material";

import ManageMovies from "./ManageMovie/ManageMovies";
import ManageUsers from "./ManageUsers/ManageUsers";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("movies");

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant={activeTab === "movies" ? "contained" : "outlined"}
          startIcon={<Movie />}
          onClick={() => setActiveTab("movies")}
        >
          Manage Movies
        </Button>

        <Button
          variant={activeTab === "users" ? "contained" : "outlined"}
          startIcon={<People />}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </Button>
      </Box>

      
      {activeTab === "movies" && <ManageMovies />}
      {activeTab === "users" && <ManageUsers />}
    </Container>
  );
};

export default AdminDashboard;
