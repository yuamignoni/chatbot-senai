// src/controllers/userController.ts
import { Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// [R] Read: Listar todos os usuários (APENAS ADMIN)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        admissionDate: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// [R] Read: Obter usuário por ID (ADMIN ou o próprio usuário)
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const requestingUser = req.user;

  if (!requestingUser) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        admissionDate: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (requestingUser.role === UserRole.ADMIN || requestingUser.id === user.id) {
      return res.status(200).json(user);
    } else {
      return res.status(403).json({ message: 'Acesso negado: Você não tem permissão para ver este usuário.' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// [U] Update: Atualizar usuário (ADMIN ou o próprio usuário)
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const requestingUser = req.user;
  const { email, password, firstName, lastName, admissionDate, role } = req.body;

  if (!requestingUser) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  try {
    const userToUpdate = await prisma.user.findUnique({ where: { id } });

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (requestingUser.role !== UserRole.ADMIN && requestingUser.id !== userToUpdate.id) {
      return res.status(403).json({ message: 'Acesso negado: Você não tem permissão para atualizar este usuário.' });
    }

    const updateData: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      admissionDate?: Date;
      role?: UserRole;
    } = {};

    if (email) updateData.email = email;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (admissionDate) updateData.admissionDate = new Date(admissionDate);

    if (role && requestingUser.role === UserRole.ADMIN) {
      if (Object.values(UserRole).includes(role.toUpperCase())) {
        updateData.role = role.toUpperCase() as UserRole;
      } else {
        return res.status(400).json({ message: 'Role inválido. Use "USER" ou "ADMIN".' });
      }
    } else if (role && requestingUser.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Acesso negado: Você não tem permissão para alterar o papel do usuário.' });
    }


    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        admissionDate: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: updatedUser });
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ message: 'Email já está em uso por outro usuário.' });
    }
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};