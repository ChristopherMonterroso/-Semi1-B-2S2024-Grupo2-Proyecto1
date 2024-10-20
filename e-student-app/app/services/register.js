import { API_BASE_URL, ENDPOINTS } from './config';

export const register = async (full_name, email, password) => {
  try {
    const body = JSON.stringify({
      full_name: full_name,
      email: email,
      password: password
    });

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Especificar que se está enviando JSON
      },
      body: body,
    });

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error al crear usuario', error);
    throw error; 
  }
};
