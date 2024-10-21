'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import styles from './Dashboard.module.css';
import { schedules } from '../services/schedule'; // Asegúrate de que la ruta sea correcta
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage = () => {
  const [studentName, setStudentName] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';
  const hasFetchedSchedule = useRef(false); // Evitar llamada doble

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))?.user;

    if (storedUser) {
      setStudentName(storedUser.full_name);

      // Verifica si ya se ha hecho la llamada para evitar que se repita
      if (storedUser.id && !hasFetchedSchedule.current) {
        hasFetchedSchedule.current = true; // Evita futuras llamadas
        fetchSchedule(storedUser.id);
      }
    } else {
      const redirectUrl = isLocal ? '/login' : '/login.html';
      router.push(redirectUrl);
    }
  }, [router, isLocal]); // Se eliminó `schedule.length` para evitar re-renderizados innecesarios

  const fetchSchedule = async (userId) => {
    try {
      const data = await schedules(userId); // Llamada al servicio para obtener el calendario
      setSchedule(data.schedules); // Almacena los horarios en el estado
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Elimina al usuario autenticado
    router.push(isLocal ? '/login' : '/login.html'); // Redirige al login según el entorno
  };

  if (loading) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras carga
  }

  return (
    <div className={styles.dashboardContainer}>
      <ToastContainer />
      <div className={styles.header}>
        <h2>Bienvenido, {studentName}</h2>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.schedule}>
          <h3>Horario del día</h3>
          {schedule.length > 0 ? (
            <ul>
              {schedule.map((item) => (
                <li key={item.id}>
                  {item.time} - {item.subject}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay clases programadas para hoy</p>
          )}
        </div>

        <div className={styles.tasks}>
          <h3>Tareas pendientes</h3>
          {/* Aquí se mostrarían las tareas dinámicamente */}
        </div>

        <div className={styles.quickActions}>
          <button className={styles.quickActionButton}>Conversor de documentos</button>
          <button className={styles.quickActionButton}>Reconocimiento de imágenes</button>
          <button className={styles.quickActionButton}>Notificaciones y recordatorios</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
