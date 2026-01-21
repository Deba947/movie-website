import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  MenuItem,
  InputAdornment
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { MovieContext } from "../../../context/MovieContext";
import Pagination from "../../../components/Pagination/Pagination";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    getAllUsers,
    searchUsers,
    addUser,
    updateUser,
    deleteUser,
    users,
    usersPagination,
    loading
  } = useContext(MovieContext);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadUsers(currentPage);
  }, []);

  const updateURL = (page, searchQuery) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  };

  const loadUsers = async (page) => {
    if (search.trim()) {
      await searchUsers(search, page, ITEMS_PER_PAGE);
    } else {
      await getAllUsers(page, ITEMS_PER_PAGE);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    updateURL(1, search);
    await loadUsers(1);
  };

  const handleClearSearch = async () => {
    setSearch('');
    setCurrentPage(1);
    updateURL(1, '');
    await getAllUsers(1, ITEMS_PER_PAGE);
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    updateURL(page, search);
    await loadUsers(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) return;

    const success = await addUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (success) {
      setOpenAdd(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true
      });
      await loadUsers(currentPage);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    const success = await updateUser(selectedUser._id, {
      role: formData.role,
      isActive: formData.isActive
    });

    if (success) {
      setOpenEdit(false);
      await loadUsers(currentPage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const success = await deleteUser(id);
      if (success) {
        await loadUsers(currentPage);
      }
    }
  };

  return (
    <div className="manage-users-page">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Manage Users
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAdd(true)}
          >
            Add User
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box display="flex" gap={2}>
            <TextField
              label="Search by name or email"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" onClick={handleSearch} sx={{ minWidth: 120 }}>
              Search
            </Button>
            {search && (
              <Button variant="outlined" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </Box>
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : users && users.length > 0 ? (
          <>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id} hover>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip label={u.role} color="primary" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.isActive ? "Active" : "Inactive"}
                          color={u.isActive ? "success" : "error"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedUser(u);
                            setFormData({
                              role: u.role,
                              isActive: u.isActive
                            });
                            setOpenEdit(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => handleDelete(u._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {usersPagination.pages > 1 && (
              <Pagination
                currentPage={usersPagination.page}
                totalPages={usersPagination.pages}
                onPageChange={handlePageChange}
              />
            )}

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Showing {users.length} of {usersPagination.total} users (Page {usersPagination.page} of {usersPagination.pages})
              </Typography>
            </Box>
          </>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary">
              No users found
            </Typography>
            {search && (
              <Typography variant="body1" color="text.secondary" mt={2}>
                Try searching with different keywords
              </Typography>
            )}
          </Box>
        )}

        {/* ADD USER DIALOG */}
        <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <TextField
              select
              label="Role"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
            <Button onClick={handleAddUser} variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* EDIT USER DIALOG */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Role"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              select
              label="Status"
              fullWidth
              sx={{ mt: 2 }}
              value={String(formData.isActive)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "true"
                })
              }
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button onClick={handleEditUser} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ManageUsers;