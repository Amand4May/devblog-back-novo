import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado ao MySQL com sucesso.");

    // Tabela de Usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar VARCHAR(255),
        bio VARCHAR(255),
        password VARCHAR(255) NOT NULL
      )
    `);

    // Tabela de Artigos 
    await connection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255),
        category VARCHAR (255) NOT NULL,
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);
    
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error);
  }
}

export default pool;