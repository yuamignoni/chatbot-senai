import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    // Prisma unique constraint error
    if (err.code === 'P2002') {
        sendError(res, 'Violação de restrição única', 400);
        return;
    }

    // Prisma not found error
    if (err.code === 'P2025') {
        sendError(res, 'Registro não encontrado', 404);
        return;
    }

    // Default error
    sendError(res, 'Erro interno do servidor');
};

export const notFoundHandler = (req: Request, res: Response): void => {
    sendError(res, 'Rota não encontrada', 404);
};
