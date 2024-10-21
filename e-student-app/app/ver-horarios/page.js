"use client";
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createSchedule, updateSchedule, deleteSchedule, getAllSchedules } from './api';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function HorarioManagement() {
  const [horarios, setHorarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentHorario, setCurrentHorario] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      const data = await getAllSchedules();
      setHorarios(data.schedules);
    } catch (error) {
      if (error.message === 'Usuario no autenticado') {
        showSnackbar('Por favor, inicie sesión para ver sus horarios', 'error');
      } else {
        showSnackbar('Error al cargar los horarios', 'error');
      }
    }
  };

  const handleOpenDialog = (horario = null) => {
    if (horario) {
      setCurrentHorario({
        ...horario,
        event_datetime: formatDateTimeForInput(horario.event_datetime)
      });
      setIsEditing(true);
    } else {
      setCurrentHorario({ course_name: '', event_datetime: '', professor: '', location: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentHorario(null);
    setIsEditing(false);
  };

  const handleSaveHorario = async () => {
    try {
      if (isEditing) {
        await updateSchedule(currentHorario.schedule_id, currentHorario);
        showSnackbar('Horario actualizado exitosamente');
      } else {
        await createSchedule(currentHorario);
        showSnackbar('Horario creado exitosamente');
      }
      fetchHorarios();
      handleCloseDialog();
    } catch (error) {
      if (error.message === 'Usuario no autenticado') {
        showSnackbar('Por favor, inicie sesión para guardar el horario', 'error');
      } else {
        showSnackbar('Error al guardar el horario', 'error');
      }
    }
  };

  const handleDeleteHorario = (id) => {
    setHorarioToDelete(id);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSchedule(horarioToDelete);
      setHorarios(horarios.filter(h => h.id !== horarioToDelete));
      showSnackbar('Horario eliminado exitosamente');
    } catch (error) {
      showSnackbar('Error al eliminar el horario', 'error');
    }
    setOpenConfirmDialog(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDateTimeForInput = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
  };

  const formatDateTimeForDisplay = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Horarios
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ mb: 3 }}
        >
          Agregar Horario
        </Button>
        <Grid container spacing={3}>
          {horarios.map((horario) => (
            <Grid item xs={12} sm={6} md={4} key={horario.schedule_id}>
              <Card>
                <CardActions>
                  <Typography variant="body1">
                    {`${horario.course_name} - ${formatDateTimeForDisplay(horario.event_datetime)}`}
                  </Typography>
                  <IconButton onClick={() => handleOpenDialog(horario)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteHorario(horario.schedule_id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {isEditing ? 'Editar Horario' : 'Agregar Horario'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre del Curso"
              type="text"
              fullWidth
              value={currentHorario ? currentHorario.course_name : ''}
              onChange={(e) => setCurrentHorario({ ...currentHorario, course_name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Fecha y Hora"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={currentHorario ? currentHorario.event_datetime : ''}
              onChange={(e) => setCurrentHorario({ ...currentHorario, event_datetime: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Profesor"
              type="text"
              fullWidth
              value={currentHorario ? currentHorario.professor : ''}
              onChange={(e) => setCurrentHorario({ ...currentHorario, professor: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Ubicación"
              type="text"
              fullWidth
              value={currentHorario ? currentHorario.location : ''}
              onChange={(e) => setCurrentHorario({ ...currentHorario, location: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSaveHorario}>Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Alert severity="warning">
              ¿Estás seguro de que quieres eliminar este horario?
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
            <Button onClick={confirmDelete} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default HorarioManagement;