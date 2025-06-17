import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { sendError } from '../utils/response';
import { JWTPayload } from '../types';

interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendError(res, 'Token não fornecido', 401);
            return;
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        req.user = decoded;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            sendError(res, 'Token expirado', 401);
            return;
        }
        if (error.name === 'JsonWebTokenError') {
            sendError(res, 'Token inválido', 401);
            return;
        }
        sendError(res, 'Erro de autenticação', 401);
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            sendError(res, 'Acesso negado', 403);
            return;
        }
        next();
    };
};