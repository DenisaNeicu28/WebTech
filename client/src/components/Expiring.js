import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Checkbox, FormControlLabel, IconButton, TextField } from '@mui/material';
import {
  AppBar,
  Stack,
  Toolbar
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();
export default function Expiring() {
  const SERVER = `${window.location.protocol}//${window.location.hostname}:3000`;
  const navigate = useNavigate();
  const [currentCategories, setCurrentCategories] = useState([]);

  const fetchExpiring = async () => {
    let route = `${SERVER}/aliments/expiring`;
    const res = await fetch(route);
    const data = await res.json();
    if (data && data.length > 0) setCurrentCategories(data);
  };

  useEffect(() => {
    fetchExpiring();
  }, []);

  const makeAvailable = (id) => {
    fetch(`${SERVER}/aliments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.message);
        fetchExpiring();
      }).catch((e) => toast.error(`Eroare!`));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main id='main'>
        <Stack spacing={2} sx={{ flexGrow: 3 }}>
          <ThemeProvider theme={theme}>
            <AppBar display='flex' position="static" color="primary" sx={{ width: '100%' }} enableColorOnDark>
              <Toolbar>
                <Typography
                  fontSize='25px'
                  component="h1" onClick={() => navigate('/')}
                  sx={{ flexGrow: 1, marginLeft: '3vw', marginTop: 2, marginBottom: 2, cursor: 'pointer' }}
                >
                  MY FRIDGE
                </Typography>
                <Toolbar>
                  <img
                    src="https://csie.ase.ro/wp-content/uploads/2020/10/cropped-CSIE_new-300x132.png"
                    style={{ width: 100 }}
                    alt="logo"
                  />
                </Toolbar>
                <Toolbar>
                </Toolbar>
              </Toolbar>
            </AppBar>
          </ThemeProvider>
        </Stack>
        <Container sx={{ py: 0, mb: 5, mt: 5 }} maxWidth="md">
          <Grid container spacing={4}>
            {currentCategories.map((item, i) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  style={{ cursor: 'pointer' }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      style={{ textAlign: 'center' }}
                    >
                      {item.name} - expiring on {new Date(item.expirationDate).getDate()}
                      .{new Date(item.expirationDate).getMonth() + 1}
                      .{new Date(item.expirationDate).getFullYear()} - {item.weight} {item.measure}
                    </Typography>
                    <FormControlLabel control={<Checkbox onChange={() => makeAvailable(item.id)} checked={item.available == true} />} label="Available" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
