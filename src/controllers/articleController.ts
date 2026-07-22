import { Request, Response } from 'express';
import pool from '../database/database';
import { AuthRequest } from '../middleware/authMiddleware'; 

// listar (GET)
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        a.id, a.title, a.content, a.excerpt, a.imageUrl, a.category, a.created_at, 
        u.name as author, 
        u.avatar as authorAvatar, 
        u.bio as authorBio
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    res.status(500).json({ error: 'Erro ao buscar os artigos.' });
  }
};

// buscar artigos do usuário logado (GET /articles/me)
export const getUserArticles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authorId = req.user?.id;

    const [rows]: any = await pool.query(`
      SELECT a.id, a.title, a.content, a.excerpt, a.imageUrl, a.category, a.created_at, u.name as author
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.author_id = ? 
      ORDER BY a.created_at DESC
    `, [authorId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar artigos do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar os seus artigos.' });
  }
};

// buscar por ID (GET /articles/:id)
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const articleId = req.params.id;
    const [rows]: any = await pool.query(`
      SELECT a.id, a.title, a.content, a.excerpt, a.imageUrl, a.category, a.created_at, u.name as author, u.avatar as authorAvatar, u.bio as authorBio
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `, [articleId]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'Artigo não encontrado.' });
      return;
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar artigo por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar o artigo.' });
  }
};

// criar (POST) - AGORA SALVANDO O EXCERPT CORRETAMENTE
export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, category, excerpt } = req.body;
    const authorId = req.user?.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || null);

    const [result]: any = await pool.query(
      'INSERT INTO articles (title, content, excerpt, imageUrl, category, author_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, excerpt || null, imageUrl, category || 'Tecnologia', authorId]
    );

    res.status(201).json({ message: 'Artigo criado com sucesso!', articleId: result.insertId });
  } catch (error) {
    console.error('Erro detalhado ao criar artigo:', error);
    res.status(500).json({ error: 'Erro ao criar o artigo.' });
  }
};

// editar (PUT)
export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articleId = req.params.id;
    const authorId = req.user?.id;
    const { title, content, excerpt, category } = req.body;

    const [result]: any = await pool.query(
      'UPDATE articles SET title = ?, content = ?, excerpt = ?, category = ? WHERE id = ? AND author_id = ?',
      [title, content, excerpt, category, articleId, authorId]
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