import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import { testConnection } from './database/database';
import userRoutes from './routes/userRoutes';
import articleRoutes from './routes/articleRoutes';
import { setupSwagger } from './swagger';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Expõe a pasta de uploads para acesso público de imagens
app.use('/uploads', express.static('uploads'));

// Inicializa Banco de Dados
testConnection();

setupSwagger(app);

// Injeção de Rotas
app.use('/usuarios', userRoutes);
app.use('/artigos', articleRoutes);

// Inicia o Servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});