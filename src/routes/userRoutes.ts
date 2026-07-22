import { Router } from 'express';
import { register, login } from '../controllers/userController';

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

export default router;