import React, { useContext, useEffect, useState } from 'react';
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
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MovieContext } from '../../../context/MovieContext';
import SearchBar from '../../../components/SearchBar/SearchBar';
import Pagination from '../../../components/Pagination/Pagination';
import './ManageMovies.css';

const ManageMovies = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    url,
    movies,
    moviesPagination,
    loading,
    fetchMovies,
    searchMovies,
    getSortedMovies,
    deleteMovie
  } = useContext(MovieContext);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Get state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortParams, setSortParams] = useState({
    sortBy: searchParams.get('sortBy') || '',
    order: searchParams.get('order') || 'desc'
  });
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    loadMovies(currentPage);
  }, []);

  // Update URL when state changes
  const updateURL = (page, search, sortBy, order) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (search) params.set('search', search);
    if (sortBy) {
      params.set('sortBy', sortBy);
      params.set('order', order);
    }
    setSearchParams(params);
  };

  const loadMovies = async (page) => {
    if (searchQuery) {
      await searchMovies(searchQuery, page, ITEMS_PER_PAGE);
    } else if (sortParams.sortBy) {
      await getSortedMovies(sortParams.sortBy, sortParams.order, page, ITEMS_PER_PAGE);
    } else {
      await fetchMovies(page, ITEMS_PER_PAGE);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSortParams({ sortBy: '', order: 'desc' });
    setCurrentPage(1);
    updateURL(1, query, '', 'desc');
    
    if (query.trim()) {
      await searchMovies(query, 1, ITEMS_PER_PAGE);
    } else {
      await fetchMovies(1, ITEMS_PER_PAGE);
    }
  };

  const handleSort = async (sortBy, order) => {
    setSortParams({ sortBy, order });
    setSearchQuery('');
    setCurrentPage(1);
    updateURL(1, '', sortBy, order);
    
    if (sortBy) {
      await getSortedMovies(sortBy, order, 1, ITEMS_PER_PAGE);
    } else {
      await fetchMovies(1, ITEMS_PER_PAGE);
    }
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    updateURL(page, searchQuery, sortParams.sortBy, sortParams.order);
    await loadMovies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMovie) {
      const success = await deleteMovie(selectedMovie._id);
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedMovie(null);
        // Reload current page
        await loadMovies(currentPage);
      }
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="manage-movies-page">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Manage Movies
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => navigate('/admin/add')}
          >
            Add New Movie
          </Button>
        </Box>

        <SearchBar 
          onSearch={handleSearch} 
          onSort={handleSort}
          initialSearch={searchQuery}
          initialSort={sortParams}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : movies && movies.length > 0 ? (
          <>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell>Poster</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Genre</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Release Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie._id} hover>
                      <TableCell>
                        <img
                          src={movie.image}
                          alt={movie.title}
                          style={{
                            width: 60,
                            height: 90,
                            objectFit: 'cover',
                            borderRadius: 4
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {movie.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {movie.director}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={movie.genre} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${movie.rating}/10`}
                          size="small"
                          color={
                            movie.rating >= 8
                              ? 'success'
                              : movie.rating >= 6
                              ? 'warning'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>{formatDuration(movie.duration)}</TableCell>
                      <TableCell>
                        {new Date(movie.releaseDate).getFullYear()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="info"
                          onClick={() => navigate(`/movie/${movie._id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/admin/edit/${movie._id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(movie)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {moviesPagination.pages > 1 && (
              <Pagination
                currentPage={moviesPagination.page}
                totalPages={moviesPagination.pages}
                onPageChange={handlePageChange}
              />
            )}

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Showing {movies.length} of {moviesPagination.total} movies (Page {moviesPagination.page} of {moviesPagination.pages})
              </Typography>
            </Box>
          </>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary">
              No movies found
            </Typography>
            {searchQuery && (
              <Typography variant="body1" color="text.secondary" mt={2}>
                Try searching with different keywords
              </Typography>
            )}
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedMovie?.title}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ManageMovies;