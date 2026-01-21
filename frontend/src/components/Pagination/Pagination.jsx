import React from 'react';
import { Box, Pagination as MuiPagination, Typography } from '@mui/material';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  if (totalPages <= 1) return null;

  return (
    <Box className="pagination-container">
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
      />
      <Typography variant="body2" color="text.secondary" mt={2}>
        Page {currentPage} of {totalPages}
      </Typography>
    </Box>
  );
};

export default Pagination;