"use client";
import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function ImageRecognitionTool() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recognitionResults, setRecognitionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRecognitionResults(null);
      setError(null);
    }
  };

  const recognizeImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file); // Enviar la imagen con clave 'image'

    const response = await fetch(`${API_BASE_URL}/user/rekognition`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el reconocimiento');
    }
    
    const data = await response.json();
    console.log(data);
    return data.result;
  };

  const handleRecognition = async () => {
    if (!selectedFile) {
      setError('Por favor, seleccione una imagen primero.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await recognizeImage(selectedFile);
      setRecognitionResults(results);
    } catch (error) {
      console.error('Error en el reconocimiento de imagen:', error);
      if (error.message === 'Usuario no autenticado') {
        setError('Por favor, inicie sesión para usar esta función.');
      } else {
        setError('Ocurrió un error durante el reconocimiento. Intente de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Herramienta de Reconocimiento de Imágenes
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                Subir Imagen
              </Button>
            </label>

            {previewUrl && (
              <Box sx={{ mt: 2, maxWidth: '100%', maxHeight: 300, overflow: 'hidden' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleRecognition}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Iniciar Reconocimiento'}
            </Button>
          </Box>
        </Paper>

        {error && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.main' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {recognitionResults && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resultados del Reconocimiento:
            </Typography>
            <List>
              {recognitionResults.Labels.map((label, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={label.Name}
                    secondary={`Confianza: ${(label.Confidence).toFixed(2)}%`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default ImageRecognitionTool;
