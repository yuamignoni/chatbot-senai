import React, { useState, useEffect } from 'react';
import './RegisterCollaborator.css';

interface EditCollaboratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updatedData: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
  }) => void;
  collaborator: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
  } | null;
}

const EditCollaborator: React.FC<EditCollaboratorProps> = ({
  isOpen,
  onClose,
  onSave,
  collaborator
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    if (collaborator) {
      setFirstName(collaborator.firstName);
      setLastName(collaborator.lastName);
      setEmail(collaborator.email);
      setPassword(''); 
      setRole(collaborator.role);
    }
  }, [collaborator]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (collaborator) {
      const updatedData = {
        firstName,
        lastName,
        email,
        role,
      };
      
      if (password) {
        onSave(collaborator.id, { ...updatedData, password });
      } else {
        onSave(collaborator.id, updatedData);
      }
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
            <label htmlFor="firstName">Primeiro Nome:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Sobrenome:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            <label htmlFor="password">Senha (deixe em branco para manter a atual):</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Função:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              required
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
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

export default EditCollaborator; 