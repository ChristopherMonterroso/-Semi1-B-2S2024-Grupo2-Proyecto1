'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import styles from './Dashboard.module.css';
import { schedules } from '../services/schedule'; // Asegúrate de que la ruta sea correcta
import { task } from '../services/task'; // Importa el servicio de tareas
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage = () => {
  const [studentName, setStudentName] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [tasks, setTasks] = useState([]); // Estado para las tareas
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
        fetchTasks(); // Llama a la función para obtener tareas
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

  const fetchTasks = async () => {
    try {
      const data = await task(); // Llamada al servicio para obtener tareas
      setTasks(data.tasks); // Almacena las tareas en el estado
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Elimina al usuario autenticado
    router.push(isLocal ? '/login' : '/login.html'); // Redirige al login según el entorno
  };

  const handleTaskClick = (taskId) => {
    // Redirige a la página de detalles de la tarea
    router.push(`/task/${taskId}`);
  };

  const handleDocumentConversionClick = () => {
    router.push(isLocal ? '/documents' : '/documents.html'); // Redirige a la página de conversión de documentos
  };

  const handleScheduleClick = () => {
    router.push(isLocal ? '/ver-horarios' : '/ver-horarios.html'); // Redirige a la página de conversión de documentos
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
          {tasks.length > 0 ? (
            <table className={styles.taskTable}>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Fecha de Vencimiento</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Creado el</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.task_id} className={styles.taskRow} onClick={() => handleTaskClick(task.task_id)}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{new Date(task.due_date).toLocaleDateString()}</td>
                    <td>{task.priority}</td>
                    <td>{task.status}</td>
                    <td>{new Date(task.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay tareas pendientes</p>
          )}
        </div>

        <div className={styles.quickActions}>
          <button className={styles.quickActionButton} onClick={handleDocumentConversionClick}>
            Conversor de documentos
          </button>
          <button className={styles.quickActionButton}>Reconocimiento de imágenes</button>
          <button className={styles.quickActionButton} onClick={handleScheduleClick}>Notificaciones y recordatorios</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
