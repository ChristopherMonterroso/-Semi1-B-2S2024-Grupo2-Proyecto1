import { API_BASE_URL, ENDPOINTS } from './config';

export const login = async (email, password) => {
    try {

        const payload = { email, password };

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        throw error; 
    }
};