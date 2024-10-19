const AWS = require("aws-sdk");
const multer = require("multer");
const crypto = require("crypto");
const File = require("../models/file"); // El modelo File que creaste

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
    region: process.env.AWS_REGION_S3,
});

const s3 = new AWS.S3();

// Configuración de multer para almacenamiento en memoria
const upload = multer({ storage: multer.memoryStorage() }).single("file");

// Crear un nuevo archivo
const uploadFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error al subir archivo", error: err, status: false });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Por favor, suba un archivo", status: false });
        }

        try {
            const { user_id } = req.body;
            if (!user_id) {
                return res.status(400).json({ message: "El campo user_id es obligatorio", status: false });
            }

            // Generar un nuevo nombre aleatorio para el archivo
            const fileName = crypto.randomBytes(16).toString("hex") + "_" + req.file.originalname;
            const fileType = req.file.mimetype;

            // Subir archivo a S3
            const uploadParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: `ArchivosUsuarios/${fileName}`, // Subir a la carpeta ArchivosUsuarios
                Body: req.file.buffer,
                ContentType: fileType,
            };

            const data = await s3.upload(uploadParams).promise();

            // Guardar la información del archivo en la base de datos
            const newFile = await File.create({
                user_id,
                file_name: fileName,
                file_type: fileType,
                s3_path: data.Location, // La URL del archivo en S3
            });

            return res.status(201).json({ message: "Archivo subido exitosamente", file: newFile, status: true });
        } catch (error) {
            console.error("Error en uploadFile:", error);
            return res.status(500).json({ message: "Error al subir archivo", error: error.message, status: false });
        }
    });
};

const getAllFiles = async (req, res) => {
    try {
        const files = await File.findAll();
        return res.status(200).json({ files, status: true });
    } catch (error) {
        console.error("Error al obtener archivos:", error);
        return res.status(500).json({ message: "Error al obtener archivos", error: error.message, status: false });
    }
};

const getFileById = async (req, res) => {
    try {
        const { file_id } = req.params;
        const file = await File.findByPk(file_id);

        if (!file) {
            return res.status(404).json({ message: "Archivo no encontrado", status: false });
        }

        return res.status(200).json({ file, status: true });
    } catch (error) {
        console.error("Error al obtener archivo:", error);
        return res.status(500).json({ message: "Error al obtener archivo", error: error.message, status: false });
    }
};

const deleteFile = async (req, res) => {
    try {
        const { file_id } = req.params;

        const file = await File.findByPk(file_id);
        if (!file) {
            return res.status(404).json({ message: "Archivo no encontrado", status: false });
        }

        // Eliminar archivo de S3
        const deleteParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `ArchivosUsuarios/${file.file_name}`, // El nombre con el que se subió
        };

        await s3.deleteObject(deleteParams).promise();

        // Eliminar registro de la base de datos
        await file.destroy();

        return res.status(200).json({ message: "Archivo eliminado exitosamente", status: true });
    } catch (error) {
        console.error("Error al eliminar archivo:", error);
        return res.status(500).json({ message: "Error al eliminar archivo", error: error.message, status: false });
    }
};

const getFilesByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Consultar los archivos por user_id
        const files = await File.findAll({
            where: { user_id },
        });

        if (files.length === 0) {
            return res.status(404).json({ message: "No se encontraron archivos para este usuario", status: false });
        }

        return res.status(200).json({ files, status: true });
    } catch (error) {
        console.error("Error al obtener archivos por user_id:", error);
        return res.status(500).json({ message: "Error al obtener archivos", error: error.message, status: false });
    }
};

module.exports = {
    uploadFile,
    getAllFiles,
    getFileById,
    deleteFile,
    getFilesByUserId
};

