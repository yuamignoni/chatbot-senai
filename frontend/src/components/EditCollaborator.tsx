import React, { useState, useEffect } from 'react';
import '../styles/register_collaborator.css';

interface Collaborator {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  cpf: string;
  data_nascimento?: string;
  data_contratacao: string;
  cargo: string;
  departamento: string;
  role: 'admin' | 'manager' | 'employee' | 'usuario';
  ativo?: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

interface EditCollaboratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updatedData: Omit<Collaborator, 'id' | 'ativo' | 'criado_em' | 'atualizado_em' | 'data_nascimento'>) => void;
  collaborator: Collaborator | null;
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

const EditCollaborator: React.FC<EditCollaboratorProps> = ({
  isOpen,
  onClose,
  onSave,
  collaborator
}) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [data_contratacao, setDataContratacao] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'employee' | 'usuario'>('employee');

  useEffect(() => {
    if (collaborator) {
      setNome(collaborator.nome);
      setEmail(collaborator.email);
      setCpf(collaborator.cpf);
      setDataContratacao(collaborator.data_contratacao.split('T')[0]); // Apenas a data
      setCargo(collaborator.cargo);
      setDepartamento(collaborator.departamento);
      setRole(collaborator.role);
      setSenha(''); 
    }
  }, [collaborator]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (collaborator) {
      const updatedData: Omit<Collaborator, 'id' | 'ativo' | 'criado_em' | 'atualizado_em' | 'data_nascimento'> = {
        nome,
        email,
        cpf,
        data_contratacao: new Date(data_contratacao).toISOString(),
        cargo,
        departamento,
        role,
      };
      
      if (senha) {
        updatedData.senha = senha;
      }
      
      onSave(collaborator.id, updatedData);
    }
    
    onClose();
  };

  if (!isOpen || !collaborator) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Editar Colaborador</h2>
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
            <label htmlFor="senha">Nova Senha (deixe em branco para manter a atual):</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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
              onChange={(e) => setRole(e.target.value as 'admin' | 'manager' | 'employee' | 'usuario')}
              required
            >
              <option value="employee">Colaborador</option>
              <option value="admin">Administrador</option>
              <option value="manager">Gerente</option>
              <option value="usuario">Usuário</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCollaborator; 