import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message: string = 'Sucesso',
    statusCode: number = 200
): void => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
    };
    res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    message: string = 'Erro interno do servidor',
    statusCode: number = 500,
    errors: string[] | null = null
): void => {
    const response: ApiResponse = {
        success: false,
        message,
        errors,
    };
    res.status(statusCode).json(response);
};
