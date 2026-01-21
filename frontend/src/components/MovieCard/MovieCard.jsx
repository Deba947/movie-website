import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="movie-card"
      onClick={() => navigate(`/movie/${movie._id}`)}
    >
      <CardMedia
        component="img"
        image={movie.image}
        alt={movie.title}
        className="movie-card-image"
      />

      <CardContent className="movie-card-content">
        <Typography className="movie-title">
          {movie.title}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating
            value={movie.rating / 2}
            precision={0.1}
            size="small"
            readOnly
          />
          <Typography variant="body2" color="text.secondary">
            {movie.rating}/10
          </Typography>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
          <Chip label={movie.genre} size="small" variant="outlined" />
          <Chip
            label={new Date(movie.releaseDate).getFullYear()}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography className="movie-description">
          {movie.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
