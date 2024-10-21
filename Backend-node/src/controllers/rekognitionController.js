const AWS = require('aws-sdk');
const multer = require('multer');
const ImageRecognitionResult = require('../models/image_recognition_results');

// Configuración de AWS Rekognition
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_REKOGNITION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_REKOGNITION,
    region: process.env.AWS_REGION_REKOGNITION,
});
const rekognition = new AWS.Rekognition();

// Configurar multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

// Controlador de reconocimiento de imágenes
exports.imageRecognition = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(500).json({ message: 'Error al procesar la imagen', error: err.message, status: false });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No se envió ninguna imagen', status: false });
            }

            // Analizar la imagen con Rekognition usando el buffer del archivo
            const rekognitionParams = {
                Image: {
                    Bytes: req.file.buffer,
                },
            };

            const recognitionResult = await rekognition.detectLabels(rekognitionParams).promise();
        

            return res.status(201).json({ result: recognitionResult, status: true });
        } catch (error) {
            console.error('Error en imageRecognition:', error);
            return res.status(500).json({ message: 'Error al analizar la imagen', error: error.message, status: false });
        }
    });
};
