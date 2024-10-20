const AWS = require('aws-sdk');
const File = require('../models/file');
const pdf = require('pdf-parse');
const path = require('path');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_POLLY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_POLLY,
    region: process.env.AWS_REGION_POLLY,
});

const polly = new AWS.Polly();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
    region: process.env.AWS_REGION_S3,
});
const s3 = new AWS.S3();

exports.textToSpeech = async (req, res) => {
    try {
        const { file_id, voice_id } = req.body;

        const file = await File.findByPk(file_id);
        if (!file) {
            return res.status(404).json({ message: 'File not found', status: false });
        }

        const key = file.s3_path.split('.com/')[1];
        const decodedKey = decodeURIComponent(key);
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: decodedKey,
        };

        const s3Data = await s3.getObject(params).promise();
        let text = '';

        // Verificar el tipo de archivo
        const fileType = path.extname(file.file_name).toLowerCase();
        if (fileType === '.pdf') {
            // Extraer texto de un PDF
            const pdfData = await pdf(s3Data.Body);
            text = pdfData.text;
        } else if (fileType === '.txt' || fileType === '.text') {
            // Extraer texto de un archivo de texto
            text = s3Data.Body.toString('utf-8');
        } else {
            return res.status(400).json({ message: 'Unsupported file type', status: false });
        }

        // Convertir el texto en audio
        const pollyParams = {
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: voice_id || 'Joanna', // Voz predeterminada si no se proporciona ninguna
        };

        const audioData = await polly.synthesizeSpeech(pollyParams).promise();

        // Subir el archivo de audio a S3
        const audioFileName = `AudiosUsuarios/${Date.now()}_audio.mp3`;
        const s3UploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: audioFileName,
            Body: audioData.AudioStream,
            ContentType: 'audio/mpeg',
        };

        await s3.upload(s3UploadParams).promise();

        return res.status(201).json({ audioUrl: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${audioFileName}`, status: true });
    } catch (error) {
        console.error('Error in textToSpeech:', error);
        return res.status(500).json({ message: 'Error al convertir texto a voz', error, status: false });
    }
};
