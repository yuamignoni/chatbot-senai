export interface JWTPayload {
    id: number;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[] | null;
}

export interface PaginationQuery {
    page?: string;
    limit?: string;
    search?: string;
    departamento?: string;
    cargo?: string;
    ativo?: string;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface FuncionarioCreateInput {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    data_nascimento?: Date;
    data_contratacao: Date;
    cargo: string;
    departamento: string;
    role: 'admin' | 'manager' | 'employee';
    ativo?: boolean;
}

export interface FuncionarioUpdateInput {
    nome?: string;
    email?: string;
    cpf?: string;
    data_nascimento?: Date;
    data_contratacao?: Date;
    cargo?: string;
    departamento?: string;
    role?: 'admin' | 'manager' | 'employee';
    ativo?: boolean;
}

export interface LoginInput {
    email: string;
    senha: string;
}