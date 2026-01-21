import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Movie as MovieIcon,
  AccountCircle,
  Dashboard,
  Logout,
  Login
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MovieContext } from '../../context/MovieContext';
import './Navbar.css';

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const { token, user, setToken, setUser } = useContext(MovieContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    handleClose();
    navigate("/");
  };

  return (
    <AppBar position="sticky" className="navbar">
      <Toolbar>
        <MovieIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Movie App
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate('/search')}>
            Search
          </Button>

          {token ? (
            <>
              {user?.role === 'admin' && (
                <Button
                  color="inherit"
                  startIcon={<Dashboard />}
                  onClick={() => navigate('/admin/manage')}
                >
                  Admin Panel
                </Button>
              )}
              
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user?.email}</Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="caption">Role: {user?.role}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<Login />}
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;