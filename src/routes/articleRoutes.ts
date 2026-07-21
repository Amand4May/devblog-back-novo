import { Router, Request, Response } from 'express';
import pool from '../database/database';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

/**
 * @swagger
 * /artigos:
 *   post:
 *     summary: Cria um novo artigo com imagem
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Artigo criado com sucesso
 */

// criar artigo
router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, content } = req.body;
  const author_id = req.user?.id; //  ID do token descriptografado

  console.log("📦 Corpo recebido (Texto):", req.body);
  console.log("🖼️ Arquivo recebido (Multer):", req.file);
  
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !content) {
    res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
    return;
  }

  try {
    await pool.execute(
      'INSERT INTO articles (title, content, imageUrl, author_id) VALUES (?, ?, ?, ?)',
      [title, content, imageUrl, author_id]
    );
    res.status(201).json({ message: 'Artigo criado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao salvar o artigo.' });
  }
});

/**
 * @swagger
 * /artigos:
 *   get:
 *     summary: Lista todos os artigos publicados
 *     responses:
 *       200:
 *         description: Lista de artigos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar os artigos.' });
  }
});

// lista todos os artigos
router.get('/', async (req: Request, res: Response): Promise<void> => {
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
});

/**
 * @swagger
 * /artigos/{id}:
 *   put:
 *     summary: Atualiza o título e conteúdo de um artigo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do artigo a ser editado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artigo atualizado com sucesso
 *       403:
 *         description: Sem permissão (ou artigo não encontrado)
 */

// atualizar
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articleId = req.params.id;
    const authorId = req.user?.id;
    const { title, content } = req.body;

    const [result]: any = await pool.query(
      'UPDATE articles SET title = ?, content = ? WHERE id = ? AND author_id = ?',
      [title, content, articleId, authorId]
    );

    // Se o MySQL avisar que 0 linhas foram alteradas, significa que ou o artigo não existe, ou não pertence a esta usuária
    if (result.affectedRows === 0) {
      res.status(403).json({ error: 'Artigo não encontrado ou você não tem permissão para editá-lo.' });
      return;
    }

    res.json({ message: 'Artigo atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o artigo.' });
  }
});

/**
 * @swagger
 * /artigos/{id}:
 *   delete:
 *     summary: Deleta um artigo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do artigo a ser deletado
 *     responses:
 *       200:
 *         description: Artigo deletado com sucesso
 *       403:
 *         description: Sem permissão (ou artigo não encontrado)
 */

// deletar
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articleId = req.params.id;
    const authorId = req.user?.id;

    const [result]: any = await pool.query(
      'DELETE FROM articles WHERE id = ? AND author_id = ?',
      [articleId, authorId]
    );

    if (result.affectedRows === 0) {
      res.status(403).json({ error: 'Artigo não encontrado ou você não tem permissão para deletá-lo.' });
      return;
    }

    res.json({ message: 'Artigo deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar o artigo.' });
  }
});

export default router;