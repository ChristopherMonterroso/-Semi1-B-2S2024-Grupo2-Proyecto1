import { API_BASE_URL, ENDPOINTS } from './config';

export const translateDocument = async (file_id, target_language) => {
    try {
        const payload = { file_id, target_language };

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TRANSLATE_FILE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al traducir el documento', error);
        throw error; 
    }
};

// Servicio para subir archivos
export const uploadFile = async (file, user_id) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', user_id);

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOAD_FILE}`, {
            method: 'POST',
            body: formData, // No es necesario especificar 'Content-Type' cuando se usa FormData
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al subir el archivo', error);
        throw error; 
    }
};

export const textToSpeech = async (file_id, voice_id) => {
    try {
        const payload = { file_id, voice_id };

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TEXT_TO_SPEECH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al convertir texto a voz', error);
        throw error; 
    }
};