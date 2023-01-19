import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();
function AdaugaCopil() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setname] = useState('');
  const [weight, setweight] = useState('');
  const [image, setimage] = useState('');
  const [measure, setMeasure] = useState('');
  const [expirationDate, setexpirtiondate] = useState('');
  const types = ['grams', 'kilograms', 'mililiters', 'liters', 'pieces'];
  const SERVER = `${window.location.protocol}//${window.location.hostname}:3000`;

  const handleSubmit = (event) => {
    event.preventDefault();
    if(image == null || image == undefined || image == ''){
      toast.error(`Adding aliment ${name} unsuccessfully!`);
      return;
    }
    const fileReader = new FileReader();
    let base64;
    fileReader.onload = (e) => {
      base64 = e.target.result;
      fetch(`${SERVER}/aliments/categories/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          image: base64,
          weight: weight,
          expirationDate: expirationDate,
          measure: measure
        }),
      })
        .then((res) => {
          if (res.status != 201) toast.error(`Adding aliment ${name} unsuccessfully!`)
          else toast.success(`Adding aliment ${name} successfully!`)
        }).catch((e) => toast.error(`Adding aliment ${name} unsuccessfully!`));
    };
    fileReader.readAsDataURL(image);
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
              Add an item
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
              <TextField
                margin="normal"
                required
                fullWidth
                type="number"
                id="weight"
                label="weight"
                name="weight"
                autoComplete="weight"
                onChange={(e) => setweight(e.target.value)}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={types}
                margin="normal"
                required
                fullWidth
                name="measure"
                label="unit of measure"
                renderInput={(params) => <TextField {...params} label="unit of measure" />}
                onInputChange={(event, newInputValue) => {
                  setMeasure(newInputValue);
                }}
              />
              <Button
                variant="contained"
                className='btn btn-primary my-3'
                component="label"
              >
                Upload image
                <input
                  type="file"
                  hidden
                  onChange={(e) => setimage(e.target.files[0])}
                />
              </Button>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="expiration date"
                  disablePast
                  value={expirationDate}
                  onChange={(newValue) => {
                    setexpirtiondate(newValue);
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
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

export default AdaugaCopil;