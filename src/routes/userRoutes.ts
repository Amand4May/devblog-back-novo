import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware'; 

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cria uma nova conta de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cadastro realizado com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Faz o login e retorna o token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem sucedido (retorna o token)
 *       401:
 *         description: E-mail ou senha inválidos
 */
router.post('/login', login);

// Buscar perfil
router.get('/me', authMiddleware, getProfile);

// Atualizar perfil (recebendo a imagem pelo campo 'avatar')
router.put('/me', authMiddleware, upload.single('avatar'), updateProfile);

export default router;