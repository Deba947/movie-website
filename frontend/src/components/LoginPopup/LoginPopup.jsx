import React, { useContext, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { MovieContext } from '../../context/MovieContext';
import { toast } from 'react-toastify';
import './LoginPopup.css';

const LoginPopup = ({ open, setOpen }) => {
  const { url, setToken, setUser } = useContext(MovieContext);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user"
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = tabValue === 0 ? "/api/user/login" : "/api/user/register";
    const data = tabValue === 0 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await axios.post(`${url}${endpoint}`, data);
      
      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success(tabValue === 0 ? "Login successful!" : "Registration successful!");
        setOpen(false);
        setFormData({ name: "", email: "", password: "", role: "user" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Welcome</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {tabValue === 1 && (
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
          )}
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          {tabValue === 1 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            size="large"
          >
            {tabValue === 0 ? "Login" : "Register"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPopup;