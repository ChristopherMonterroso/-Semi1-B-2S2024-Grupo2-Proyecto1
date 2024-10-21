'use client';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';
import { register } from '../services/register'; // Asegúrate de que la ruta sea correcta
import { confirm } from '../services/login'; // Servicio para confirmar el código de verificación

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerificationStep, setIsVerificationStep] = useState(false); // Estado para mostrar el formulario de verificación
  const [verificationCode, setVerificationCode] = useState(''); // Código de verificación
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';

  // Manejo del envío del formulario de registro
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
        // Paso 1 completado: se oculta el formulario de registro y se muestra el de verificación
        setIsVerificationStep(true);
        toast.success('Registro exitoso. Por favor, ingrese el código de verificación enviado a su correo.');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Ocurrió un error, intente de nuevo.');
      console.error(error);
    }
  };

  // Manejo del envío del código de verificación
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      toast.error('Por favor, ingrese el código de verificación.');
      return;
    }

    try {
      // Llamada al servicio para confirmar el código de verificación
      const data = await confirm(email, verificationCode);

      if (data.status) {
        // Guardar datos en localStorage y en una cookie
        localStorage.setItem('user', JSON.stringify(data));
        Cookies.set('user', JSON.stringify(data), { expires: 1 });

        toast.success('Verificación exitosa');
        setTimeout(() => {
          const redirectUrl = isLocal ? '/login' : '/login.html';
          router.push(redirectUrl);  // Redirigir al home después de la verificación
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Ocurrió un error durante la verificación.');
      console.error(error);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <ToastContainer />

      {isVerificationStep ? (
        // Formulario de verificación
        <form className={styles.form} onSubmit={handleVerificationSubmit}>
          <h2 className={styles.centerText}>Verificación de cuenta</h2>
          <input
            type="text"
            placeholder="Código de verificación"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>Verificar</button>
        </form>
      ) : (
        // Formulario de registro
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
      )}
    </div>
  );
};

export default RegisterPage;
