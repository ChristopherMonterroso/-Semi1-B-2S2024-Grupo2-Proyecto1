'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Documents.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConvertDocumentsPage = () => {
  const [file, setFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [convertToSpeech, setConvertToSpeech] = useState(false);
  const router = useRouter(); // Inicializa el enrutador

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error('Por favor, sube un archivo.');
      return;
    }

    // Aquí iría la lógica para subir el archivo a S3 y luego llamar a las funciones de AWS
    // Por ahora solo mostramos un mensaje de éxito.
    toast.success('Archivo subido y conversión iniciada.');
  };

  const handleGoBack = () => {
    router.back(); // Regresa a la página anterior (dashboard)
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h2>Herramienta de conversión de documentos</h2>
      <div className={styles.form}>
      <input type="file" className={styles.fileInput} onChange={handleFileChange} accept=".pdf,.doc,.docx" />

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
    </div>
  );
};

export default ConvertDocumentsPage;
