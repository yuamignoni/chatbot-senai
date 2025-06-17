import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            sendError(res, errorMessage, 400);
            return;
        }
        next();
    };
};

// Validation schemas
export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email deve ter um formato válido',
        'any.required': 'Email é obrigatório'
    }),
    senha: Joi.string().min(6).required().messages({
        'string.min': 'Senha deve ter no mínimo 6 caracteres',
        'any.required': 'Senha é obrigatória'
    })
});

export const funcionarioCreateSchema = Joi.object({
    nome: Joi.string().max(100).required().messages({
        'string.max': 'Nome deve ter no máximo 100 caracteres',
        'any.required': 'Nome é obrigatório'
    }),
    email: Joi.string().email().max(100).required().messages({
        'string.email': 'Email deve ter um formato válido',
        'string.max': 'Email deve ter no máximo 100 caracteres',
        'any.required': 'Email é obrigatório'
    }),
    senha: Joi.string().min(6).max(255).required().messages({
        'string.min': 'Senha deve ter no mínimo 6 caracteres',
        'string.max': 'Senha deve ter no máximo 255 caracteres',
        'any.required': 'Senha é obrigatória'
    }),
    cpf: Joi.string().length(14).required().messages({
        'string.length': 'CPF deve ter 14 caracteres (formato: XXX.XXX.XXX-XX)',
        'any.required': 'CPF é obrigatório'
    }),
    data_nascimento: Joi.date().optional(),
    data_contratacao: Joi.date().required().messages({
        'any.required': 'Data de contratação é obrigatória'
    }),
    cargo: Joi.string().max(100).required().messages({
        'string.max': 'Cargo deve ter no máximo 100 caracteres',
        'any.required': 'Cargo é obrigatório'
    }),
    departamento: Joi.string().max(100).required().messages({
        'string.max': 'Departamento deve ter no máximo 100 caracteres',
        'any.required': 'Departamento é obrigatório'
    }),
    role: Joi.string().valid('admin', 'manager', 'employee').required().messages({
        'any.only': 'Role deve ser: admin, manager ou employee',
        'any.required': 'Role é obrigatório'
    }),
    ativo: Joi.boolean().optional()
});

export const funcionarioUpdateSchema = Joi.object({
    nome: Joi.string().max(100).optional(),
    email: Joi.string().email().max(100).optional(),
    cpf: Joi.string().length(14).optional(),
    data_nascimento: Joi.date().optional(),
    data_contratacao: Joi.date().optional(),
    cargo: Joi.string().max(100).optional(),
    departamento: Joi.string().max(100).optional(),
    role: Joi.string().valid('admin', 'manager', 'employee').optional(),
    ativo: Joi.boolean().optional()
});
