const AWS = require('aws-sdk');
const File = require('../models/file');
const ImageRecognitionResult = require('../models/image_recognition_results');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_REKOGNITION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_REKOGNITION,
    region: process.env.AWS_REGION_REKOGNITION,
});

const rekognition = new AWS.Rekognition();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
    region: process.env.AWS_REGION_S3,
});
const s3 = new AWS.S3();

exports.imageRecognition = async (req, res) => {
    try {
        const { file_id, user_id } = req.body;

        // Buscar el archivo en la base de datos
        const file = await File.findByPk(file_id);
        if (!file) {
            return res.status(404).json({ message: 'File not found', status: false });
        }

        // Extraer la clave del s3_path
        const key = file.s3_path.split('.com/')[1];
        const decodedKey = decodeURIComponent(key);
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: decodedKey,
        };

        // Descargar la imagen desde S3
        try {
            
            const s3Data = await s3.getObject(params).promise();


            // Analizar la imagen usando Rekognition
            const rekognitionParams = {
                Image: {
                    Bytes: s3Data.Body,
                },
            };

            const recognitionResult = await rekognition.detectLabels(rekognitionParams).promise();
            const resultString = JSON.stringify(recognitionResult);

            // Guardar el resultado en la tabla ImageRecognitionResult
            const imageRecognitionResult = await ImageRecognitionResult.create({
                user_id,
                file_id,
                recognition_result: resultString,
            });

            return res.status(201).json({ result: imageRecognitionResult, status: true });
        } catch (s3Error) {
            console.error('S3 Error:', s3Error);
            return res.status(500).json({ message: 'Error al obtener la imagen de S3', error: s3Error, status: false });
        }
    } catch (error) {
        console.error('Error in imageRecognition:', error);
        return res.status(500).json({ message: 'Error al analizar la imagen', error: error.message, status: false });
    }
};
