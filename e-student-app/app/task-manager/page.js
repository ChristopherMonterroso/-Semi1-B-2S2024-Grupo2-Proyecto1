"use client";
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  FlagOutlined,
  Flag,
  PendingOutlined,
  RotateRightOutlined,
  CheckCircleOutline
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Cookies from 'js-cookie';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta':
        return <Flag color="error" />;
      case 'media':
        return <Flag color="warning" />;
      case 'baja':
        return <FlagOutlined color="success" />;
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente':
        return <PendingOutlined color="error" />;
      case 'en progreso':
        return <RotateRightOutlined color="warning" />;
      case 'completada':
        return <CheckCircleOutline color="success" />;
      default:
        return null;
    }
  };
  


function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const userData = JSON.parse(Cookies.get('user'));
      const user = userData.user;
      const response = await fetch(`${API_BASE_URL}/user/tasks/${user.id}`);
      const data = await response.json();
      if (data.status) {
        console.log('data:', data);
        setTasks(data.tasks);

      } else {
        throw new Error(data.message || 'Error fetching tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Error fetching tasks. Please try again.');
    }
  };

  const handleOpenDialog = (task = null) => {
    setCurrentTask(task || { title: '', description: '', due_date: new Date(), priority: 'medium', status: 'pending' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTask(null);
  };

  const handleSaveTask = async () => {
    try {
    const userData = JSON.parse(Cookies.get('user'));
    const user = userData.user;
      const method = currentTask.task_id ? 'PUT' : 'POST';
      const url = currentTask.task_id
        ? `${API_BASE_URL}/user/task/${currentTask.task_id}`
        : `${API_BASE_URL}/user/task`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentTask,
          user_id: user.id,
          due_date: currentTask.due_date.toISOString(),
        }),
      });

      const data = await response.json();
      console.log('data:', data);
      if (data.status) {
        fetchTasks();
        handleCloseDialog();
      } else {
        throw new Error(data.message || 'Error saving task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Error saving task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/task/${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.status) {
        fetchTasks();
      } else {
        throw new Error(data.message || 'Error deleting task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Error deleting task. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Tareas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ mb: 3 }}
        >
          Agregar Tarea
        </Button>
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.task_id}>
              <Card>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha límite: {new Date(task.due_date).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getPriorityIcon(task.priority)}
                    <Typography variant="body2" sx={{ ml: 1, mr: 2 }}>
                      {task.priority}
                    </Typography>
                    {getStatusIcon(task.status)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {task.status}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleOpenDialog(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(task.task_id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {currentTask && currentTask.task_id ? 'Editar Tarea' : 'Agregar Tarea'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Título"
              type="text"
              fullWidth
              value={currentTask ? currentTask.title : ''}
              onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Descripción"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={currentTask ? currentTask.description : ''}
              onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha límite"
                value={currentTask ? currentTask.due_date : null}
                onChange={(newValue) => setCurrentTask({ ...currentTask, due_date: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
              />
            </LocalizationProvider>
            <FormControl fullWidth margin="dense">
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={currentTask ? currentTask.priority : ''}
                onChange={(e) => setCurrentTask({ ...currentTask, priority: e.target.value })}
              >
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="media">Media</MenuItem>
                <MenuItem value="baja">Baja</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Estado</InputLabel>
              <Select
                value={currentTask ? currentTask.status : ''}
                onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="en progreso">En progreso</MenuItem>
                <MenuItem value="completada">Completada</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSaveTask}>Guardar</Button>
          </DialogActions>
        </Dialog>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default TaskManagement;