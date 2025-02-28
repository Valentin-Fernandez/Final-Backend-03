import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import __dirname from './utils/index.js';

// Configuracion de Swagger
const swaggerOption = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'Documentacion de API',
        },
    },
    apis: [`${__dirname}/../docs/**/*.yaml`],
};

const swaggerDocs = swaggerJsDoc(swaggerOption);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const url_DB = `mongodb+srv://valentin:L6uTdxmCIDDSDNEo@cluster.l4f2k.mongodb.net/`;

async function connectDB() {
    try {
        await mongoose.connect(url_DB);
        console.log('Conectado con exito!');
    } catch (error) {
        console.error('Error al conectarse a la DB', error);
    }
}

connectDB();

export default app;
