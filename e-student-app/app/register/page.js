'use client';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';
import { register } from '../services/register'; // Asegúrate de que la ruta sea correcta

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      // Llamada al servicio de registro
      const data = await register(name, email, password);

      if (data.status) {
        // Guardar datos en localStorage y en una cookie
        localStorage.setItem('user', JSON.stringify(data));
        Cookies.set('user', JSON.stringify(data), { expires: 1 });

        toast.success('Registro exitoso');
        setTimeout(() => {
          const redirectUrl = isLocal ? '/home' : '/home.html';
          router.push(redirectUrl);  // Redirigir al home después de registrar
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Ocurrió un error, intente de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <ToastContainer />
      <img src="/images/logo.png" alt="Logo" className={styles.logo} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>Registrarse</button>

        <p className={styles.centerText}>
          ¿Ya tienes una cuenta? <a href={isLocal ? "/login" : "/login.html"}>Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
