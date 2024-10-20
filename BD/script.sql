-- Crear la base de datos eStudent
CREATE DATABASE eStudent;

-- Usar la base de datos recién creada
USE eStudent;

-- Tabla para almacenar los usuarios del sistema
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE, -- Autenticación multifactor (MFA)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para gestionar los horarios académicos del estudiante
CREATE TABLE schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    professor VARCHAR(255),
    location VARCHAR(255),
    event_datetime DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla para gestionar las tareas y actividades
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    priority ENUM('alta', 'media', 'baja') NOT NULL,
    status ENUM('pendiente', 'en progreso', 'completada') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla para almacenar los archivos cargados por los usuarios (documentos para conversión)
CREATE TABLE files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    s3_path VARCHAR(255) NOT NULL, -- Ruta en S3 donde se almacena el archivo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla para los resultados del reconocimiento de imágenes
CREATE TABLE image_recognition_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_id INT NOT NULL,
    recognition_result TEXT NOT NULL, -- Resultado del análisis de la imagen
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE
);

-- Tabla para los recordatorios (notificaciones)
CREATE TABLE reminders (
    reminder_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    reminder_datetime DATETIME NOT NULL,
    sent BOOLEAN DEFAULT FALSE, -- Indica si el recordatorio fue enviado
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);
