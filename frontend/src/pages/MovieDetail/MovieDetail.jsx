import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Rating,
  CircularProgress,
  Paper,
  Divider,
  Button,
  Dialog,
  IconButton
} from '@mui/material';
import {
  CalendarToday,
  Timer,
  Person,
  Movie as MovieIcon,
  ArrowBack,
  Close
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieContext } from '../../context/MovieContext';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMovieById, loading } = useContext(MovieContext);

  const [movie, setMovie] = useState(null);
  const [openGallery, setOpenGallery] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    loadMovie();
    // eslint-disable-next-line
  }, [id]);

  const loadMovie = async () => {
    const data = await getMovieById(id);
    if (data) setMovie(data);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  if (loading || !movie) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <div className="movie-detail-page">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back
        </Button>

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={movie.image}
                alt={movie.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  minHeight: 500
                }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Box p={4}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  {movie.title}
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Rating value={movie.rating / 2} precision={0.1} size="large" readOnly />
                  <Typography variant="h5" color="primary">
                    {movie.rating}/10
                  </Typography>
                </Box>

                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  <Chip icon={<MovieIcon />} label={movie.genre} color="primary" />
                  <Chip icon={<CalendarToday />} label={formatDate(movie.releaseDate)} />
                  <Chip icon={<Timer />} label={formatDuration(movie.duration)} />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Synopsis
                </Typography>
                <Typography paragraph sx={{ lineHeight: 1.8 }}>
                  {movie.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Director
                </Typography>
                <Typography color="text.secondary">{movie.director}</Typography>

                {movie.cast?.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Cast
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {movie.cast.map((actor, i) => (
                        <Chip key={i} label={actor} variant="outlined" />
                      ))}
                    </Box>
                  </>
                )}

                {movie.sceneImages?.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Scenes
                    </Typography>

                    <Box className="scene-gallery">
                      {movie.sceneImages.map((img, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={img}
                          alt={`scene-${index}`}
                          className="scene-gallery-img"
                          onClick={() => {
                            setActiveImage(img);
                            setOpenGallery(true);
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog open={openGallery} onClose={() => setOpenGallery(false)} fullScreen>
        <Box className="fullscreen-gallery">
          <IconButton className="fullscreen-close" onClick={() => setOpenGallery(false)}>
            <Close />
          </IconButton>

          <Box component="img" src={activeImage} alt="scene-fullscreen" className="fullscreen-image" />
        </Box>
      </Dialog>
    </div>
  );
};

export default MovieDetail;
