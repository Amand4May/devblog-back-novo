import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../controllers/articleController';

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
router.post('/', authMiddleware, upload.single('image'), createArticle);

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
router.get('/', getArticles);

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
router.put('/:id', authMiddleware, updateArticle);

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
router.delete('/:id', authMiddleware, deleteArticle);

export default router;