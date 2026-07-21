import express, { Application } from 'express';
import cors from 'cors';
import { testConnection } from './database/database';
import userRoutes from './routes/userRoutes';
import articleRoutes from './routes/articleRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Expõe a pasta de uploads para acesso público de imagens
app.use('/uploads', express.static('uploads'));

// Inicializa Banco de Dados
testConnection();

// Injeção de Rotas
app.use('/usuarios', userRoutes);
app.use('/artigos', articleRoutes);

// Inicia o Servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});