'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Documents.module.css';
import { uploadFile, translateDocument, textToSpeech } from '../services/documents'; // Asegúrate de importar tus servicios
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConvertDocumentsPage = () => {
  const [file, setFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [convertToSpeech, setConvertToSpeech] = useState(false);
  const [userId, setUserId] = useState('');
  const [translatedText, setTranslatedText] = useState(''); // Estado para el texto traducido
  const [audioUrl, setAudioUrl] = useState(''); // Estado para la URL del audio
  const router = useRouter(); // Inicializa el enrutador

  useEffect(() => {
    // Obtener el ID del usuario desde localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.user) {
      setUserId(storedUser.user.id);
    } else {
      router.push('/login'); // Redirige a login si no hay usuario
    }
  }, [router]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error('Por favor, sube un archivo.');
      return;
    }

    try {
      if (!userId) {
        toast.error('No se encontró el ID de usuario.');
        return;
      }

      // Subir el archivo
      const uploadResponse = await uploadFile(file, userId);
      
      if (!uploadResponse.status) {
        toast.error(uploadResponse.message || 'Error al subir el archivo.');
        return;
      }

      const fileId = uploadResponse.file.file_id; // Asegúrate de que esto sea correcto según tu respuesta

      if (convertToSpeech) {
        // Llamar a la función de texto a voz
        const voiceResponse = await textToSpeech(fileId); // Aquí se asume que el voice_id es manejado en el backend
        if (!voiceResponse.status) {
          toast.error(voiceResponse.message || 'Error al convertir a voz.');
          return;
        }
        setAudioUrl(voiceResponse.audioUrl); // Establece la URL del audio en el estado
        toast.success('Conversión a texto a voz completada.');
      } else {
        // Llamar a la función de traducción
        const translateResponse = await translateDocument(fileId, targetLanguage);
        
        if (!translateResponse.status) {
          toast.error(translateResponse.message || 'Error al traducir el documento.');
          return;
        }

        setTranslatedText(translateResponse.translatedText); // Establece el texto traducido en el estado
        toast.success('Archivo subido y traducción completada.');
      }

    } catch (error) {
      console.error('Error durante la conversión:', error);
      toast.error('Error durante el proceso de conversión.');
    }
  };

  const handleGoBack = () => {
    router.back(); // Regresa a la página anterior (dashboard)
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h2>Herramienta de conversión de documentos</h2>
      <div className={styles.form}>
        <input 
          type="file" 
          className={styles.fileInput} 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx" 
        />

        <div className={styles.languageSelection}>
          <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)}>
            <option value="en">Inglés</option>
            <option value="es">Español</option>
            {/* Agregar más idiomas según sea necesario */}
          </select>
          <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            {/* Agregar más idiomas según sea necesario */}
          </select>
        </div>
        <div className={styles.speechOption}>
          <input
            type="checkbox"
            checked={convertToSpeech}
            onChange={(e) => setConvertToSpeech(e.target.checked)}
          />
          <label>Convertir a texto a voz</label>
        </div>
        <button className={styles.convertButton} onClick={handleConvert}>
          Iniciar conversión
        </button>
        <button className={styles.goBackButton} onClick={handleGoBack}>
          Regresar al Dashboard
        </button>
      </div>

      {/* Mostrar el reproductor de audio si se ha convertido a voz */}
      {convertToSpeech && audioUrl && (
        <div className={styles.audioPlayerContainer}>
          <h3>Audio:</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      )}

      {/* Mostrar el textarea si no se convierte a voz */}
      {!convertToSpeech && (
        <div className={styles.translatedTextContainer}>
          <h3>Texto Traducido:</h3>
          <textarea
            className={styles.translatedTextArea}
            value={translatedText}
            readOnly // Solo lectura
            rows={10} // Ajusta el número de filas según tus necesidades
          />
        </div>
      )}
    </div>
  );
};

export default ConvertDocumentsPage;
