const AWS = require('aws-sdk');
const File = require('../models/file');
const pdf = require('pdf-parse');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_TRASNLATE,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TRANSLATE,
    region: process.env.AWS_REGION_TRANSLATE,
});

const translate = new AWS.Translate();
const s3 = new AWS.S3();

function splitText(text, maxSize) {
    const chunks = [];
    let currentChunk = '';

    for (const word of text.split(' ')) {
        // Verificar si añadir la siguiente palabra excede el tamaño máximo
        if ((Buffer.byteLength(currentChunk + ' ' + word) <= maxSize)) {
            currentChunk += (currentChunk ? ' ' : '') + word; // Añadir la palabra al chunk
        } else {
            // Si excede, agregar el chunk actual a la lista y empezar uno nuevo
            chunks.push(currentChunk);
            currentChunk = word; // Iniciar un nuevo chunk con la palabra actual
        }
    }
    // Agregar el último chunk si existe
    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

exports.translateDocument = async (req, res) => {
    try {
        const { file_id, target_language } = req.body;

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

        // Descargar el archivo desde S3
        try {
            const s3Data = await s3.getObject(params).promise();

            // Validar el tipo de contenido
            const contentType = s3Data.ContentType;
            let text = '';

            if (contentType === 'application/pdf') {
                const pdfBuffer = s3Data.Body;

                // Extraer texto del PDF
                const pdfData = await pdf(pdfBuffer);
                text = pdfData.text;
            } else if (contentType === 'text/plain') {
                // Convertir el buffer a texto si es un archivo de texto
                text = s3Data.Body.toString('utf-8');
            } else {
                return res.status(400).json({ message: 'El archivo debe ser un PDF o un archivo de texto', status: false });
            }

            // Dividir el texto en partes más pequeñas
            const chunks = splitText(text, 10000); // 10,000 bytes

            // Traducir cada chunk
            const translatedChunks = [];
            for (const chunk of chunks) {
                const translateParams = {
                    Text: chunk,
                    SourceLanguageCode: 'auto',
                    TargetLanguageCode: target_language,
                };
                const translatedData = await translate.translateText(translateParams).promise();
                translatedChunks.push(translatedData.TranslatedText);
            }

            // Combinar todos los textos traducidos
            const finalTranslation = translatedChunks.join(' ');

            // Enviar la traducción al cliente
            return res.status(200).json({ translatedText: finalTranslation, status: true });

        } catch (s3Error) {
            console.error('S3 Error:', s3Error);
            return res.status(500).json({ message: 'Error al obtener archivo de S3', error: s3Error, status: false });
        }
    } catch (error) {
        console.error('Error in translateDocument:', error);
        return res.status(500).json({ message: 'Error al traducir documento', error, status: false });
    }
};
