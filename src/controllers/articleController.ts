import { Request, Response } from 'express';
import pool from '../database/database';
import { AuthRequest } from '../middleware/authMiddleware'; 

// listar (GET)
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(`
      SELECT a.id, a.title, a.content, a.imageUrl, a.created_at, u.name as author
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar artigos.' });
  }
};

// criar (POST)
export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const authorId = req.user?.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result]: any = await pool.query(
      'INSERT INTO articles (title, content, image_url, author_id) VALUES (?, ?, ?, ?)',
      [title, content, imageUrl, authorId]
    );

    res.status(201).json({ message: 'Artigo criado com sucesso!', articleId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o artigo.' });
  }
};

// editar (PUT)
export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articleId = req.params.id;
    const authorId = req.user?.id;
    const { title, content } = req.body;

    const [result]: any = await pool.query(
      'UPDATE articles SET title = ?, content = ? WHERE id = ? AND author_id = ?',
      [title, content, articleId, authorId]
    );

    if (result.affectedRows === 0) {
      res.status(403).json({ error: 'Artigo não encontrado ou sem permissão.' });
      return;
    }

    res.json({ message: 'Artigo atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o artigo.' });
  }
};

// deletar (DELETE)
export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articleId = req.params.id;
    const authorId = req.user?.id;

    const [result]: any = await pool.query(
      'DELETE FROM articles WHERE id = ? AND author_id = ?',
      [articleId, authorId]
    );

    if (result.affectedRows === 0) {
      res.status(403).json({ error: 'Artigo não encontrado ou sem permissão.' });
      return;
    }

    res.json({ message: 'Artigo deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar o artigo.' });
  }
};