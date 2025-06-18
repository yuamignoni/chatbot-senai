import React, { useState } from 'react';
import RegisterCollaborator from '../components/RegisterCollaborator';
import EditCollaborator from '../components/EditCollaborator';
import '../styles/manager.css';

interface Collaborator {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  admissionDate: string;
}

const Manager: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 1, firstName: 'João', lastName: 'Silva', email: 'joao.silva@example.com', password: 'senha-super-secreta-1', role: 'admin', admissionDate: '2023-01-15' },
    { id: 2, firstName: 'Maria', lastName: 'Santos', email: 'maria.santos@example.com', password: 'outra-senha-secreta-2', role: 'user', admissionDate: '2023-03-22' },
  ]);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [currentCollaborator, setCurrentCollaborator] = useState<Collaborator | null>(null);

  const handleAddCollaborator = (newCollaborator: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    admissionDate: string;
  }) => {
    const newId = collaborators.length > 0 ? Math.max(...collaborators.map(c => c.id)) + 1 : 1;
    
    setCollaborators([
      ...collaborators,
      {
        id: newId,
        ...newCollaborator
      }
    ]);
  };

  const handleEditCollaborator = (id: number, updatedData: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
    admissionDate: string;
  }) => {
    setCollaborators(collaborators.map(collab => 
      collab.id === id ? { ...collab, ...updatedData } : collab
    ));
  };

  const handleRemoveCollaborator = (id: number) => {
    setCollaborators(collaborators.filter(collab => collab.id !== id));
  };

  const openEditPopup = (collaborator: Collaborator) => {
    setCurrentCollaborator(collaborator);
    setIsEditPopupOpen(true);
  };

  return (
    <div id='manager-page' className='flex-center flex-column flex__justify-start flex__gap-30 padding-50 min-height-100vh'>
      <h1>Colaboradores</h1>
      <div className="collaborators-section">
        <button 
          className="add-button"
          onClick={() => setIsRegisterPopupOpen(true)}
        >
          Adicionar Colaborador
        </button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Primeiro Nome</th>
              <th>Sobrenome</th>
              <th>E-mail</th>
              <th>Senha</th>
              <th>Role</th>
              <th>Data de Admissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {collaborators.map((collab) => (
              <tr key={collab.id}>
                <td>{collab.id}</td>
                <td>{collab.firstName}</td>
                <td>{collab.lastName}</td>
                <td>{collab.email}</td>
                <td>{'********'}</td>
                <td>{collab.role}</td>
                <td>{collab.admissionDate}</td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => openEditPopup(collab)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleRemoveCollaborator(collab.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RegisterCollaborator
        isOpen={isRegisterPopupOpen}
        onClose={() => setIsRegisterPopupOpen(false)}
        onSave={handleAddCollaborator}
      />

      <EditCollaborator
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onSave={handleEditCollaborator}
        collaborator={currentCollaborator}
      />
    </div>
  );
};

export default Manager;
