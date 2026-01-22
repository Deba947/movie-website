import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import LoginPopup from './components/LoginPopup/LoginPopup';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import MovieDetail from './pages/MovieDetail/MovieDetail';

import AddMovie from './pages/Admin/AddMovie/AddMovie';
import EditMovie from './pages/Admin/EditMovie/EditMovie';
import AdminDashboard from './pages/Admin/AdminDashboard';

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
        />

        <Navbar setShowLogin={setShowLogin} />
        <LoginPopup open={showLogin} setOpen={setShowLogin} />

        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetail />} />

          
          <Route
            path="/admin/manage"
            element={
              <ProtectedRoute adminOnly>
                <Navigate to="/admin" replace />
              </ProtectedRoute>
            }
          />

          
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          
          <Route
            path="/admin/add"
            element={
              <ProtectedRoute adminOnly>
                <AddMovie />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <EditMovie />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
