import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { CloudUpload, Add as AddIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { MovieContext } from '../../../context/MovieContext';
import './EditMovie.css';

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMovieById, updateMovie } = useContext(MovieContext); 

  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  s
  const [sceneImages, setSceneImages] = useState([]);
  const [scenePreviews, setScenePreviews] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
    genre: '',
    director: '',
    cast: []
  });

  const [castInput, setCastInput] = useState('');

  const genres = [
    'Action','Adventure','Comedy','Drama','Fantasy',
    'Horror','Mystery','Romance','Sci-Fi','Thriller',
    'Crime','Documentary','Animation','Biography','Musical'
  ];

  useEffect(() => {
    loadMovie();
    
  }, [id]);

  const loadMovie = async () => {
    const movie = await getMovieById(id);
    if (movie) {
      setFormData({
        title: movie.title,
        description: movie.description,
        rating: movie.rating,
        releaseDate: movie.releaseDate.split('T')[0],
        duration: movie.duration,
        genre: movie.genre,
        director: movie.director,
        cast: movie.cast || []
      });

      
      setImagePreview(movie.image);

      if (movie.sceneImages?.length) {
        setScenePreviews(movie.sceneImages);
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  
  const handleSceneImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    setSceneImages(files);
    setScenePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleAddCast = () => {
    if (castInput.trim() && !formData.cast.includes(castInput.trim())) {
      setFormData({
        ...formData,
        cast: [...formData.cast, castInput.trim()]
      });
      setCastInput('');
    }
  };

  const handleDeleteCast = (actor) => {
    setFormData({
      ...formData,
      cast: formData.cast.filter(c => c !== actor)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('rating', formData.rating);
    data.append('releaseDate', formData.releaseDate);
    data.append('duration', formData.duration);
    data.append('genre', formData.genre);
    data.append('director', formData.director);
    data.append('cast', JSON.stringify(formData.cast));

    if (image) data.append('image', image);
    sceneImages.forEach(img => data.append('sceneImages', img));

    const success = await updateMovie(id, data);
    if (success) navigate('/admin/manage');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <div className="edit-movie-wrapper">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Edit Movie
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Update the movie details below
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              {/* Poster */}
              <Grid item xs={12}>
                <Box
                  className="edit-poster-box"
                  onClick={() => document.getElementById('poster-upload').click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Poster" className="edit-poster-preview" />
                  ) : (
                    <>
                      <CloudUpload className="edit-upload-icon" />
                      <Typography>Click to upload new poster</Typography>
                    </>
                  )}
                  <input
                    id="poster-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Box>
              </Grid>

              {/* Scene Images */}
              <Grid item xs={12}>
                <Typography fontWeight={600} mb={1}>
                  Scene Images (optional, max 6)
                </Typography>

                <Button variant="outlined" component="label">
                  Select Scene Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleSceneImagesChange}
                  />
                </Button>

                <Box mt={2} className="scene-preview-container">
                  {scenePreviews.map((src, i) => (
                    <img key={i} src={src} alt="scene" className="scene-preview-img" />
                  ))}
                </Box>
              </Grid>

              {/* Fields */}
              <Grid item xs={12}>
                <TextField fullWidth label="Movie Title" name="title" value={formData.title} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Rating (0-10)" name="rating" type="number" value={formData.rating} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Release Date" name="releaseDate" type="date" InputLabelProps={{ shrink: true }} value={formData.releaseDate} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Duration (minutes)" name="duration" type="number" value={formData.duration} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Genre</InputLabel>
                  <Select name="genre" value={formData.genre} onChange={handleChange}>
                    {genres.map(g => (
                      <MenuItem key={g} value={g}>{g}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Director" name="director" value={formData.director} onChange={handleChange} required />
              </Grid>

              {/* Cast */}
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Add Cast Member"
                    value={castInput}
                    onChange={(e) => setCastInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCast())}
                  />
                  <Button variant="outlined" onClick={handleAddCast}>
                    <AddIcon />
                  </Button>
                </Box>

                <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                  {formData.cast.map((actor, i) => (
                    <Chip
                      key={i}
                      label={actor}
                      onDelete={() => handleDeleteCast(actor)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={() => navigate('/admin/manage')}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Update Movie
                  </Button>
                </Box>
              </Grid>

            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default EditMovie;
