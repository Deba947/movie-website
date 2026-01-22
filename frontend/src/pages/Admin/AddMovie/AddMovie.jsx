import React, { useContext, useState } from 'react';
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
  Chip
} from '@mui/material';
import { CloudUpload, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MovieContext } from '../../../context/MovieContext';
import './AddMovie.css';

const AddMovie = () => {
  const navigate = useNavigate();
  const { addMovie } = useContext(MovieContext);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Scene images
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

  // Scene images handler (max 6)
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

  const handleDeleteCast = (castToDelete) => {
    setFormData({
      ...formData,
      cast: formData.cast.filter(c => c !== castToDelete)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select a movie poster');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('rating', formData.rating);
    data.append('releaseDate', formData.releaseDate);
    data.append('duration', formData.duration);
    data.append('genre', formData.genre);
    data.append('director', formData.director);
    data.append('cast', JSON.stringify(formData.cast));
    data.append('image', image);

    //  append scene images
    sceneImages.forEach(img => data.append('sceneImages', img));

    const success = await addMovie(data);
    if (success) navigate('/admin/manage');
  };

  return (
    <div className="add-movie-wrapper">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Add New Movie
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Fill in the details below to add a new movie
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              {/* Poster Upload */}
              <Grid item xs={12}>
                <Box
                  className="poster-upload-box"
                  onClick={() => document.getElementById('poster-upload').click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Poster" className="poster-preview" />
                  ) : (
                    <>
                      <CloudUpload className="upload-icon" />
                      <Typography>Click to upload movie poster</Typography>
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

  <Button
    variant="outlined"
    component="label"
  >
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
      <img
        key={i}
        src={src}
        alt="scene"
        className="scene-preview-img"
      />
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
                <TextField fullWidth label="Rating (0-10)" name="rating" type="number" inputProps={{ min: 0, max: 10, step: 0.1 }} value={formData.rating} onChange={handleChange} required />
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
                    <Chip key={i} label={actor} onDelete={() => handleDeleteCast(actor)} color="primary" variant="outlined" />
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
                    Add Movie
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

export default AddMovie;
