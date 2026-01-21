import React, { useContext, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { MovieContext } from '../../context/MovieContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import Pagination from '../../components/Pagination/Pagination';
import './Search.css';

const Search = () => {
  const { url, movies, moviesPagination, searchMovies, loading } = useContext(MovieContext);
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const ITEMS_PER_PAGE = 8; // 4 columns × 2 rows

  const handleSearch = async (page = 1) => {
    if (!query.trim()) return;

    setHasSearched(true);
    await searchMovies(query, page, ITEMS_PER_PAGE);
  };

  const handlePageChange = (page) => {
    handleSearch(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="search-page">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4} textAlign="center">
          <Typography variant="h3" component="h1" gutterBottom className="page-title">
            Search Movies
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Find your favorite movies by title or description
          </Typography>

          <Box display="flex" gap={2} justifyContent="center" maxWidth="800px" mx="auto">
            <TextField
              fullWidth
              placeholder="Enter movie title or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: 'white', borderRadius: 2 }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => handleSearch()}
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : hasSearched ? (
          movies && movies.length > 0 ? (
            <>
              <Typography variant="h5" mb={3}>
                Search Results ({moviesPagination.total} found)
              </Typography>
              
              {/* 4 Columns Grid */}
              <Grid container spacing={3}>
                {movies.map((movie) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                    <MovieCard movie={movie} url={url} />
                  </Grid>
                ))}
              </Grid>

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
                No movies found for "{query}"
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={2}>
                Try searching with different keywords
              </Typography>
            </Box>
          )
        ) : (
          <Box textAlign="center" py={8}>
            <SearchIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              Start searching for movies
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default Search;