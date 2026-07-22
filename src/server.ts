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

// Expõe a pasta de uploads para acesso público de imagens (Mantendo a forma mais segura com path)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Inicializa Banco de Dados
testConnection();

// Inicia a documentação
setupSwagger(app);

// Injeção de Rotas
app.use(userRoutes); 
app.use('/articles', articleRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});