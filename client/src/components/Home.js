import React, { useEffect, useState } from 'react';
import TablePagination from '@mui/material/TablePagination';
import Card from '@mui/material/Card';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
export default function Home() {
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    fetchPaginated(newPage, categoriestPerPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setCategoriesPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
    fetchPaginated(0, parseInt(event.target.value, 10))
  };

  const SERVER = `${window.location.protocol}//${window.location.hostname}:3000`;
  const [aliments, setAliments] = useState([]);
  const [noExpiring, setNoExpiring] = useState(0);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriestPerPage, setCategoriesPerPage] = useState(1);
  const [noPages, setNoPages] = useState(10);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [reversedOrder, setReversedOrder] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [qualityFilter, setQualityFilter] = useState("");
  const [col, setCol] = useState("");

  const fetchPaginated = async (newPage, limit, url) => {
    let how = '';
    let colSort = (col && col != "") ? `&sort=${col}` : '';
    if (colSort != '') how = reversedOrder ? '&how=DESC' : '&how=ASC';
    let f1 = nameFilter ? `&name=${nameFilter}` : '';
    let f2 = qualityFilter ? `&quality=${qualityFilter}` : '';
    let p = (nameFilter || qualityFilter) ? 0 : newPage;
    setCurrentPage(p);
    let route = url != null ? url : `${SERVER}/categories/?page=${p}${colSort}${how}${f1}${f2}&pageSize=${limit}`;
    localStorage.setItem('currentPage', currentPage);
    localStorage.setItem('categoriesPerPage', categoriestPerPage);
    localStorage.setItem('link', route);
    const res = await fetch(route);
    const data = await res.json();
    if (data.count == 0) toast.error(`No categories!`);
    else {
      setCurrentCategories(data.rows);
      setNoPages(data.count)
    }
  };

  const fetchNoExpiring = async () => {
    const res = await fetch(`${SERVER}/aliments/expiring`);
    const data = await res.json();
    if (data.length > 0) {
      setNoExpiring(data.length);
      toast.warn(`${data.length} aliment(s) expiring!`);
    }
    else { toast.error(`No aliments are expiring!`); setNoExpiring(0) }
  };

  const fetchAliments = async (id) => {
    const res = await fetch(`${SERVER}/aliments/categories/${id}`);
    const data = await res.json();
    if (data.length > 0) setAliments(data);
    else { toast.error(`This category doesn't have aliments!`); setAliments([]) }
  };

  useEffect(() => {
    let url = localStorage.getItem('link') ? localStorage.getItem('link') : null;
    let cp = localStorage.getItem('currentPage');
    if (cp) setCurrentPage(cp);
    let ppp = localStorage.getItem('categoriesPerPage');
    if (ppp) setCategoriesPerPage(ppp);
    if (url) setCategoriesPerPage(parseInt(url.charAt(url.length - 1)))
    fetchPaginated(parseInt(cp), parseInt(ppp), url);
    fetchNoExpiring();
  }, []);

  const deleteCategory = (key) => {
    fetch(`${SERVER}/categories/${key}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        fetchPaginated(currentPage, categoriestPerPage);
      });
  }
  const deleteCopil = (idCopil, idParinte) => {
    fetch(`${SERVER}/aliments/${idCopil}/categories/${idParinte}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        fetchAliments(idParinte);
      });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main id='main'>
      <Stack spacing={2} sx={{ flexGrow: 3}}>
      <ThemeProvider theme={theme}>
        <AppBar display='flex' position="static" color="primary" sx={{ width:'100%'}} enableColorOnDark>
          <Toolbar>
            <Typography
              fontSize='25px'
              component="h1" onClick={() => navigate('/')}
              sx={{ flexGrow: 1, marginLeft: '3vw',marginTop:2,marginBottom:2 ,cursor:"pointer"}}
            >
             MY FRIDGE
            </Typography>
            <Typography
              fontSize='20px'
              component="a" color='white' onClick={() => navigate('/expiring')}
              sx={{ flexGrow: 1, marginLeft: '3vw',marginTop:2,marginBottom:2 }}
            >
             Expiring soon: {noExpiring}
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
        <Box
          sx={{ bgcolor: 'background.paper', pt: 4, pb: 6, }}>
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {`Your fridge`}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              <IconButton color="secondary" onClick={() => navigate('/add')}>
                <AddIcon />Add food category
              </IconButton> &nbsp;&nbsp;
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="md" >
          <TextField sx={{ py: 0, mt: -2 }}
            label="name" variant="standard" id='name'
            onChange={(e) => setNameFilter(e.target.value)} />
          <IconButton color="secondary" onClick={() => fetchPaginated(currentPage, categoriestPerPage)}>
            <SearchIcon />
          </IconButton>
          <TextField sx={{ ml: 2, mt: -2 }}
            label="quality" variant="standard" id='quality'
            onChange={(e) => setQualityFilter(e.target.value)} />
          <IconButton color="secondary" onClick={() => fetchPaginated(currentPage, categoriestPerPage)}>
            <SearchIcon />
          </IconButton>
          <Button onClick={() => { setCol('name'); fetchPaginated(currentPage, categoriestPerPage); }} variant='outlined'>Sort name</Button>
          <FormControlLabel sx={{ ml: 1 }}
            control={
              <Checkbox
                onChange={() => { setReversedOrder(!reversedOrder); }}
              />
            }
            label="Desc"
          />
          <TablePagination
            component="div"
            count={noPages}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={categoriestPerPage}
            rowsPerPageOptions={[1, 2, 4, 6]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Container>
        <Container sx={{ py: 0, mb: 5 }} maxWidth="md">
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
                  <IconButton color="secondary">
                    <DeleteForeverIcon onClick={() => { deleteCategory(item.id) }} /> &nbsp;&nbsp;&nbsp;
                    <PreviewIcon onClick={() => { fetchAliments(item.id) }} />
                  </IconButton>
                  <CardMedia
                    component="img"
                    image="./food.jpg"
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="p"
                      component="h5"
                      style={{ textAlign: 'center' }}
                    >
                      {item.id}. {item.name} -  quality: {item.quality}
                    </Typography>
                    <Button size="small" fullWidth onClick={() => { navigate(`/add/${item.id}/copil`) }} variant="outlined">Add aliment</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Container sx={{ py: 0, mt: 5, mb: 5 }} maxWidth="md">
          {aliments[0] && (<Typography
            component="h3"
            variant="h4"
            align="left"
            color="blue"
            gutterBottom
            sx={{ paddingTop: 5, paddingBottom: 0 }}
          >
            {`Aliments for category ${aliments[0].CategoryId}`}
          </Typography>)}
          <Grid container spacing={4} sx={{ py: 0, mt: 1, mb: 5 }} >
            {aliments && aliments.map((childItem, i) => (
              <Grid item key={childItem.id} xs={12} sm={6} md={4}> 
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  style={{ cursor: 'pointer' }}
                > <IconButton color="secondary">
                    <DeleteForeverIcon onClick={() => { deleteCopil(childItem.id, childItem.CategoryId) }} /> &nbsp;&nbsp;&nbsp;
                  </IconButton>
                  <CardMedia
                    component="img"
                    image={childItem.image}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      style={{ textAlign: 'center' }}
                    >
                      {childItem.name} - expiring on {new Date(childItem.expirationDate).getDate()}
                      .{new Date(childItem.expirationDate).getMonth() + 1}
                      .{new Date(childItem.expirationDate).getFullYear()} - {childItem.weight} {childItem.measure}
                    </Typography>
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
