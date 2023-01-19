import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();
function AddPlaylists() {
  const navigate = useNavigate();
  const [name, setname] = useState('');
  const [quality, setquality] = useState('');
  const types = ['I', 'II', 'Bio', 'Premium', 'Deluxe'];
  const SERVER = `${window.location.protocol}//${window.location.hostname}:3000`;

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${SERVER}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        quality: quality
      }),
    })
      .then((res) => {
        if (res.status != 201) toast.error(`Adding category ${name} failed!`)
        else toast.success(`Category ${name} added!`)
      })
      .catch((e) => toast.error(`Adding category ${name} failed!`));
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={2.5}
        />
        <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Add a category
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="name"
                name="name"
                autoComplete="name"
                onChange={(e) => setname(e.target.value)}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={types}
                margin="normal"
                required
                fullWidth
                name="quality"
                label="quality"
                renderInput={(params) => <TextField {...params} label="quality" />}
                onInputChange={(event, newInputValue) => {
                  setquality(newInputValue);
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained" color="success"
                sx={{ mt: 3, mb: 2 }}
              >
                Add
              </Button>
              <Button
                fullWidth
                type='button'
                variant="outlined" color="error"
                sx={{ mt: 3, mb: 2 }}
                onClick={
                  () => navigate('/')
                }
              >
                Back
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default AddPlaylists;