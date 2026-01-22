import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { MovieContext } from '../../context/MovieContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
import './Home.css';

const Home = () => {
  const {
    url,
    movies,
    moviesPagination,
    fetchMovies,
    searchMovies,
    getSortedMovies,
    loading
  } = useContext(MovieContext);

  const [searchParams, setSearchParams] = useSearchParams();

  
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );

  const [sortParams, setSortParams] = useState({
    sortBy: searchParams.get('sortBy') || '',
    order: searchParams.get('order') || 'desc'
  });

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page')) || 1
  );

  const ITEMS_PER_PAGE = 8;

  // Load Movies on Mount 
  useEffect(() => {
    loadMovies(currentPage);
    
  }, []);

  
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

  // Fetch Logic 
  const loadMovies = async (page) => {
    if (searchQuery) {
      await searchMovies(searchQuery, page, ITEMS_PER_PAGE);
    } else if (sortParams.sortBy) {
      await getSortedMovies(
        sortParams.sortBy,
        sortParams.order,
        page,
        ITEMS_PER_PAGE
      );
    } else {
      await fetchMovies(page, ITEMS_PER_PAGE);
    }
  };

  // Search 
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

 // Sort 
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

  // Pagination 
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    updateURL(page, searchQuery, sortParams.sortBy, sortParams.order);
    await loadMovies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4} textAlign="center">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            className="page-title"
          >
            Discover Amazing Movies
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore our collection of top-rated films from around the world
          </Typography>
        </Box>

        {/* Search & Sort */}
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
            
<Box className="movie-grid">
  {movies.map((movie) => (
    <MovieCard
      key={movie._id}
      movie={movie}
      url={url}
    />
  ))}
</Box>


            {/* Pagination */}
            {moviesPagination.pages > 1 && (
              <Pagination
                currentPage={moviesPagination.page}
                totalPages={moviesPagination.pages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Footer Info */}
            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Showing {movies.length} of {moviesPagination.total} movies
                (Page {moviesPagination.page} of {moviesPagination.pages})
              </Typography>
            </Box>
          </>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary">
              No movies found
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default Home;
