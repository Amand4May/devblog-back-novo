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

export default router;