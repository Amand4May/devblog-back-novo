import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/database';
import { AuthRequest } from '../middleware/authMiddleware'; 

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-super-segura-devblog';

// ==========================================
// AUTENTICAÇÃO (LOGIN E REGISTRO)
// ==========================================

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // verificar se o usuário já existe no banco
    const [existingUsers]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      res.status(400).json({ error: 'E-mail já cadastrado.' });
      return;
    }

    // criptografar a senha para não salvar em texto puro
    const hashedPassword = await bcrypt.hash(password, 10);

    // salvar o novo usuário no MySQL
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error('Erro no register:', error);
    res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // buscar o usuário no banco pelo e-mail
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0]; // Pega o primeiro usuário retornado

    if (!user) {
      res.status(401).json({ error: 'E-mail ou senha inválidos.' });
      return;
    }

    // comparar a senha digitada com a criptografada no banco
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      res.status(401).json({ error: 'E-mail ou senha inválidos.' });
      return;
    }

    // gerar o token ID real do banco
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });

    res.status(200).json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email, 
        avatar: user.avatar,
        bio: user.bio
      } 
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
};

// ==========================================
// PERFIL DO USUÁRIO
// ==========================================

// Buscar dados do perfil logado
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    const [rows]: any = await pool.query(
      'SELECT id, name, email, avatar, bio FROM users WHERE id = ?', 
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};


// Atualizar o perfil
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, bio, avatarUrl } = req.body; 

    // Salva direto o nome, a bio e a URL do avatar enviada pelo front-end
    await pool.query(
      'UPDATE users SET name = ?, bio = ?, avatar = ? WHERE id = ?',
      [name, bio || null, avatarUrl || null, userId]
    );

    // Busca os dados atualizados no banco para devolver ao front-end
    const [rows]: any = await pool.query(
      'SELECT id, name, email, avatar, bio FROM users WHERE id = ?', 
      [userId]
    );

    const updatedUser = rows[0];

    res.status(200).json({ 
      message: 'Perfil atualizado com sucesso!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};