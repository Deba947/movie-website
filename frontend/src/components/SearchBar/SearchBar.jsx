import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import './SearchBar.css';

const SearchBar = ({ onSearch, onSort, initialSearch = '', initialSort = { sortBy: '', order: 'desc' } }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort.sortBy);
  const [order, setOrder] = useState(initialSort.order);

  // Update local state when initial values change
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setSortBy(initialSort.sortBy);
    setOrder(initialSort.order);
  }, [initialSort]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (value) {
      onSort(value, order);
    } else {
      onSort('', '');
    }
  };

  const handleOrderChange = (e) => {
    const value = e.target.value;
    setOrder(value);
    if (sortBy) {
      onSort(sortBy, value);
    }
  };

  return (
    <Paper elevation={3} className="search-bar-container">
      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          fullWidth
          placeholder="Search movies by title or description..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 2, minWidth: '250px' }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="name">Title</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="releaseDate">Release Date</MenuItem>
            <MenuItem value="duration">Duration</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={order}
            label="Order"
            onChange={handleOrderChange}
            disabled={!sortBy}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default SearchBar;