import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword } from '../utils/password';
import { sendSuccess, sendError } from '../utils/response';
import {
    FuncionarioCreateInput,
    FuncionarioUpdateInput,
    PaginationQuery,
    PaginationResult
} from '../types';

export const createFuncionario = async (req: Request, res: Response): Promise<void> => {
    try {
        const funcionarioData: FuncionarioCreateInput = req.body;

        const existingEmail = await prisma.funcionario.findUnique({
            where: { email: funcionarioData.email },
        });

        if (existingEmail) {
            sendError(res, 'Email já está em uso', 400);
            return;
        }

        const existingCPF = await prisma.funcionario.findUnique({
            where: { cpf: funcionarioData.cpf },
        });

        if (existingCPF) {
            sendError(res, 'CPF já está em uso', 400);
            return;
        }

        const hashedPassword = await hashPassword(funcionarioData.senha);
        const { senha, ...funcionarioDataSemSenha } = funcionarioData;

        const funcionario = await prisma.funcionario.create({
            data: {
                ...funcionarioDataSemSenha,
                senha_hash: hashedPassword,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,
                data_nascimento: true,
                data_contratacao: true,
                cargo: true,
                departamento: true,
                role: true,
                ativo: true,
                criado_em: true,
                atualizado_em: true,
            },
        });

        sendSuccess(res, funcionario, 'Funcionário criado com sucesso', 201);
    } catch (error) {
        console.error('Create funcionario error:', error);
        sendError(res, 'Erro interno do servidor');
    }
};

export const getFuncionarios = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            page = '1',
            limit = '10',
            search,
            departamento,
            cargo,
            ativo
        }: PaginationQuery = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {};

        if (search) {
            where.OR = [
                { nome: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { cpf: { contains: search } },
            ];
        }

        if (departamento) {
            where.departamento = { contains: departamento, mode: 'insensitive' };
        }

        if (cargo) {
            where.cargo = { contains: cargo, mode: 'insensitive' };
        }

        if (ativo !== undefined) {
            where.ativo = ativo === 'true';
        }

        const [funcionarios, total] = await Promise.all([
            prisma.funcionario.findMany({
                where,
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cpf: true,
                    data_nascimento: true,
                    data_contratacao: true,
                    cargo: true,
                    departamento: true,
                    role: true,
                    ativo: true,
                    criado_em: true,
                    atualizado_em: true,
                },
                skip,
                take: limitNum,
                orderBy: { criado_em: 'desc' },
            }),
            prisma.funcionario.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limitNum);

        const result: PaginationResult<typeof funcionarios[0]> = {
            data: funcionarios,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPreviousPage: pageNum > 1,
            },
        };

        sendSuccess(res, result, 'Funcionários recuperados com sucesso');
    } catch (error) {
        console.error('Get funcionarios error:', error);
        sendError(res, 'Erro interno do servidor');
    }
};

export const getFuncionarioById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const funcionario = await prisma.funcionario.findUnique({
            where: { id: parseInt(<string>id) },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,
                data_nascimento: true,
                data_contratacao: true,
                cargo: true,
                departamento: true,
                role: true,
                ativo: true,
                criado_em: true,
                atualizado_em: true,
            },
        });

        if (!funcionario) {
            sendError(res, 'Funcionário não encontrado', 404);
            return;
        }

        sendSuccess(res, funcionario, 'Funcionário recuperado com sucesso');
    } catch (error) {
        console.error('Get funcionario by id error:', error);
        sendError(res, 'Erro interno do servidor');
    }
};

export const updateFuncionario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData: FuncionarioUpdateInput = req.body;

        const existingFuncionario = await prisma.funcionario.findUnique({
            where: { id: parseInt(<string>id) },
        });

        if (!existingFuncionario) {
            sendError(res, 'Funcionário não encontrado', 404);
            return;
        }

        if (updateData.email && updateData.email !== existingFuncionario.email) {
            const existingEmail = await prisma.funcionario.findUnique({
                where: { email: updateData.email },
            });

            if (existingEmail) {
                sendError(res, 'Email já está em uso', 400);
                return;
            }
        }

        if (updateData.cpf && updateData.cpf !== existingFuncionario.cpf) {
            const existingCPF = await prisma.funcionario.findUnique({
                where: { cpf: updateData.cpf },
            });

            if (existingCPF) {
                sendError(res, 'CPF já está em uso', 400);
                return;
            }
        }

        const funcionario = await prisma.funcionario.update({
            where: { id: parseInt(<string>id) },
            data: {
                ...updateData,
                atualizado_em: new Date(),
            },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,
                data_nascimento: true,
                data_contratacao: true,
                cargo: true,
                departamento: true,
                role: true,
                ativo: true,
                criado_em: true,
                atualizado_em: true,
            },
        });

        sendSuccess(res, funcionario, 'Funcionário atualizado com sucesso');
    } catch (error) {
        console.error('Update funcionario error:', error);
        sendError(res, 'Erro interno do servidor');
    }
};

export const deleteFuncionario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const existingFuncionario = await prisma.funcionario.findUnique({
            where: { id: parseInt(<string>id) },
        });

        if (!existingFuncionario) {
            sendError(res, 'Funcionário não encontrado', 404);
            return;
        }

        // Soft delete - set ativo to false instead of actual deletion
        await prisma.funcionario.update({
            where: { id: parseInt(<string>id) },
            data: {
                ativo: false,
                atualizado_em: new Date(),
            },
        });

        sendSuccess(res, null, 'Funcionário desativado com sucesso');
    } catch (error) {
        console.error('Delete funcionario error:', error);
        sendError(res, 'Erro interno do servidor');
    }
};
