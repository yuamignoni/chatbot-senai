import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import funcionarioRoutes from './funcionarioRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/funcionarios', funcionarioRoutes);

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

export default router;
