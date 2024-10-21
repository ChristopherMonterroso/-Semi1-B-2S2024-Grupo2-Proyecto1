import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getUserId = () => {
  const Data = Cookies.get('user');
  if (Data) {
    const userParse = JSON.parse(Data);
    const user = userParse.user;
    return user.id;
  }
  return null;
};

// Función auxiliar para manejar errores de fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la petición');
  }
  return response.json();
};

// Crear un nuevo horario
export const createSchedule = async (scheduleData) => {
  try {
    console.log('scheduleData:', scheduleData);
    const userId = getUserId();
    if (!userId) throw new Error('Usuario no autenticado');

    const response = await fetch(`${API_BASE_URL}/user/shedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...scheduleData, user_id: userId }),
    });
    console.log('response:', response);
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

// Actualizar un horario existente
export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('Usuario no autenticado');

    const response = await fetch(`${API_BASE_URL}/user/shedule/${scheduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...scheduleData, user_id: userId }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

// Eliminar un horario
export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/shedule/${scheduleId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

// Obtener un horario por ID
export const getScheduleById = async (scheduleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/shedule/${scheduleId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

// Obtener todos los horarios del usuario actual
export const getAllSchedules = async () => {
  try {
    const userId = getUserId();
    if (!userId) throw new Error('Usuario no autenticado');

    const response = await fetch(`${API_BASE_URL}/user/shedules/${userId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching all schedules:', error);
    throw error;
  }
};

// Obtener horarios por ID de usuario
export const getSchedulesByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/shedules/${userId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching schedules by user ID:', error);
    throw error;
  }
};