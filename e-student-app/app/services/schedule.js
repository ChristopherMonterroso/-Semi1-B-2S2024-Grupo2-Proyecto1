import { API_BASE_URL, ENDPOINTS } from './config';

export const schedules = async (id) => {
    try {
        
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.SCHEDULES}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al obtener el calendario', error);
        throw error; 
    }
};
