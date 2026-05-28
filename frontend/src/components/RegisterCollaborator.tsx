import React, { useState } from 'react';
import '../styles/register_collaborator.css';

interface RegisterCollaboratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collaborator: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    data_contratacao: string;
    cargo: string;
    departamento: string;
    role: 'admin' | 'manager' | 'employee';
  }) => void;
}

// Função para formatar CPF (XXX.XXX.XXX-XX)
const formatCPF = (cpf: string): string => {
  // Remove tudo que não for número
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Se já tem 11 dígitos, formatar
  if (cleanCPF.length === 11) {
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // Se já está formatado ou tem outro tamanho, retornar como está
  return cpf;
};

const RegisterCollaborator: React.FC<RegisterCollaboratorProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [data_contratacao, setDataContratacao] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'employee'>('employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nome,
      email,
      senha,
      cpf: formatCPF(cpf),
      data_contratacao: new Date(data_contratacao).toISOString(),
      cargo,
      departamento,
      role,
    });
    setNome('');
    setEmail('');
    setSenha('');
    setCpf('');
    setDataContratacao('');
    setCargo('');
    setDepartamento('');
    setRole('employee');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Cadastrar Novo Colaborador</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              value={formatCPF(cpf)}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="data_contratacao">Data de Contratação:</label>
            <input
              type="date"
              id="data_contratacao"
              value={data_contratacao}
              onChange={(e) => setDataContratacao(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cargo">Cargo:</label>
            <input
              type="text"
              id="cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="departamento">Departamento:</label>
            <input
              type="text"
              id="departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Função:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'manager' | 'employee')}
              required
            >
              <option value="employee">Colaborador</option>
              <option value="admin">Administrador</option>
              <option value="manager">Gerente</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCollaborator;
