import { Router } from 'express';
import {
    createFuncionario,
    getFuncionarios,
    getFuncionarioById,
    updateFuncionario,
    deleteFuncionario,
} from '../controllers/funcionarioController';
import { authenticate, authorize } from '../middleware/auth';
import {
    validate,
    funcionarioCreateSchema,
    funcionarioUpdateSchema,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create funcionario - only admin and manager can create
router.post(
    '/',
    authorize('admin', 'manager'),
    validate(funcionarioCreateSchema),
    createFuncionario
);

// Get all funcionarios - all authenticated users can view
router.get('/', getFuncionarios);

// Get funcionario by ID - all authenticated users can view
router.get('/:id', getFuncionarioById);

// Update funcionario - only admin and manager can update
router.put(
    '/:id',
    authorize('admin', 'manager'),
    validate(funcionarioUpdateSchema),
    updateFuncionario
);

// Delete (deactivate) funcionario - only admin can delete
router.delete('/:id', authorize('admin'), deleteFuncionario);

export default router;