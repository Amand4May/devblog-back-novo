import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database/database';

const router = Router();

// novo usuario com senha encriptada
router.post('/cadastro', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  
  try {
    // embaralha 10x
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // insere o usuario no banco de dados
    await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error: any) {
    // Trata erro de email duplicado no MySQL
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Este email já está em uso.' });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// autentica usuario e retorna token jwt
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  try {
    // busca o usuario no banco pelo email
    const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    // token dura 1d
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1d' });
    
    res.status(200).json({ message: 'Login realizado com sucesso!', token });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

export default router;