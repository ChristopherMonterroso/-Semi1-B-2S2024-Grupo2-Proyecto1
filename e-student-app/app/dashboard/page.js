'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

const DashboardPage = () => {
  const [studentName, setStudentName] = useState('');
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.user?.full_name) {
      setStudentName(storedUser.user.full_name);
    } else {
      const redirectUrl = isLocal ? '/login' : '/login.html';
      //router.push(redirectUrl);
    }
  }, [router, isLocal]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push(isLocal ? '/login' : '/login.html');
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2>Bienvenido, {studentName}</h2>
        <button className={styles.logoutButton} onClick={handleLogout}>Cerrar sesión</button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.schedule}>
          <h3>Horario del día</h3>
          {/* Aquí se mostraría el horario dinámicamente */}
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
