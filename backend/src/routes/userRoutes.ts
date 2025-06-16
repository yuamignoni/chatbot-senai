// src/routes/userRoutes.ts
import { Router } from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = Router();

// Rotas para CRUD de Usuários

// [R] Read: Listar todos os usuários (Requer autenticação e ADMIN)
router.get('/', authenticateToken, authorizeAdmin, getAllUsers);

// [R] Read: Obter usuário por ID (Requer autenticação; ADMIN pode ver qualquer um, USER só a si mesmo)
router.get('/:id', authenticateToken, getUserById);

// [U] Update: Atualizar usuário (Requer autenticação; ADMIN pode atualizar qualquer um, USER só a si mesmo)
router.put('/:id', authenticateToken, updateUser);

// [D] Delete: Deletar usuário (Requer autenticação e ADMIN)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

export default router;