'use client';
import { useState, useEffect } from 'react';
import { login } from '../services/login'; // Asegúrate de que la ruta sea correcta
import styles from './Login.module.css';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))?.user;
    if (storedUser) {
      const redirectUrl = isLocal ? '/dashboard' : '/dashboard.html';
      router.push(redirectUrl);
    } else {
      setLoading(false);
    }
  }, [router, isLocal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(usernameOrEmail, password); // Llamada al servicio login
      if (data.status) {
        localStorage.setItem('user', JSON.stringify(data));
        Cookies.set('user', JSON.stringify(data), { expires: 1 });
        const redirectUrl = isLocal ? '/dashboard' : '/dashboard.html';
        router.push(redirectUrl);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Ocurrió un error, intente de nuevo.');
      console.error(error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className={styles.loginContainer}>
      <ToastContainer />
      <img src="/images/logo.png" alt="Logo" className={styles.logo} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de usuario o correo electrónico"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Iniciar sesión</button>
        
        <p className={styles.centerText}>
          ¿No tienes una cuenta? <a href={isLocal ? "/register" : "/register.html"}>Regístrate aquí</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
