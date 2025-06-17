import { Request, Response } from 'express';
import prisma from '../config/database';
import { generateToken } from '../config/jwt';
import { comparePassword } from '../utils/password';
import { sendSuccess, sendError } from '../utils/response';
import { LoginInput, JWTPayload } from '../types';

interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha }: LoginInput = req.body;

    // Find user by email
    const funcionario = await prisma.funcionario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha_hash: true,
        role: true,
        ativo: true,
        cargo: true,
        departamento: true,
      },
    });

    if (!funcionario) {
      sendError(res, 'Credenciais inválidas', 401);
      return;
    }

    if (!funcionario.ativo) {
      sendError(res, 'Conta desativada', 401);
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(senha, funcionario.senha_hash);
    if (!isPasswordValid) {
      sendError(res, 'Credenciais inválidas', 401);
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: funcionario.id,
      email: funcionario.email,
      role: funcionario.role,
    });

    // Remove password from response
    const { senha_hash, ...funcionarioData } = funcionario;

    sendSuccess(res, {
      token,
      funcionario: funcionarioData,
    }, 'Login realizado com sucesso');

  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Erro interno do servidor');
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: req.user!.id },
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

    sendSuccess(res, funcionario, 'Perfil recuperado com sucesso');
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Erro interno do servidor');
  }
};