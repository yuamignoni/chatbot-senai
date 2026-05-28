import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterCollaborator from '../components/RegisterCollaborator';
import EditCollaborator from '../components/EditCollaborator';
import '../styles/manager.css';

interface CollaboratorFromAPI {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  cpf: string;
  data_nascimento?: string;
  data_contratacao: string;
  cargo: string;
  departamento: string;
  role: 'admin' | 'manager' | 'employee' | 'usuario'; // API pode retornar "usuario"
  ativo?: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

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
  role: 'admin' | 'manager' | 'employee'; // Para enviar à API
  ativo?: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

const Manager: React.FC = () => {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<CollaboratorFromAPI[]>([]);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [currentCollaborator, setCurrentCollaborator] = useState<CollaboratorFromAPI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:3000/api/v1/funcionarios';

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!token || !isAuthenticated) {
      console.log('🚫 Usuário não autenticado, redirecionando para login...');
      navigate('/login');
      return;
    }
    
    fetchCollaborators();
  }, [navigate]);

  const fetchCollaborators = async () => {
    console.log('🔄 Iniciando fetch dos colaboradores...');
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔐 Token encontrado:', !!token);
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }
      
      const response = await fetch(`${API_URL}?ativo=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expirado ou inválido. Faça login novamente.');
        }
        throw new Error(`Erro ao buscar colaboradores: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Dados recebidos da API:', data);
      console.log('📦 Array de colaboradores:', data.data?.data);
      console.log('📦 Quantidade de colaboradores:', data.data?.data?.length || 0);
      
      if (data.success && data.data && Array.isArray(data.data.data)) {
        setCollaborators(data.data.data);
        console.log('✅ Colaboradores definidos no state:', data.data.data.length);
      } else {
        console.error('❌ Estrutura de dados inesperada:', data);
        setError('Estrutura de dados inesperada da API');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar colaboradores:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollaborator = async (newCollaborator: Omit<Collaborator, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      // Formatar os dados antes de enviar
      const formattedCollaborator = {
        ...newCollaborator,
        cpf: formatCPF(newCollaborator.cpf), // Formatar CPF
        role: mapRoleForAPI(newCollaborator.role) // Garantir role válido
      };

      console.log('📤 Dados do novo colaborador:', formattedCollaborator);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formattedCollaborator),
      });
      if (response.ok) {
        fetchCollaborators();
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao adicionar colaborador:', errorData);
        setError(`Erro ao adicionar colaborador: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
      setError(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Função para mapear roles do banco para roles válidos da API
  const mapRoleForAPI = (role: string): 'admin' | 'manager' | 'employee' => {
    switch (role) {
      case 'admin':
        return 'admin';
      case 'manager':
        return 'manager';
      case 'usuario':
      case 'employee':
      default:
        return 'employee';
    }
  };

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

  const handleEditCollaborator = async (id: number, updatedData: Omit<CollaboratorFromAPI, 'id' | 'ativo' | 'criado_em' | 'atualizado_em' | 'data_nascimento'>) => {
    console.log('🔄 Iniciando edição do colaborador:', id);
    console.log('📝 Dados para atualização:', updatedData);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      // Preparar dados para envio (remover campos que não devem ser enviados e mapear role)
      const dataToSend = { ...updatedData };
      
      // Garantir que o role seja válido para a API
      const mappedRole = mapRoleForAPI(dataToSend.role);
      const finalData = {
        ...dataToSend,
        role: mappedRole,
        cpf: formatCPF(dataToSend.cpf), // Formatar CPF
        // Garantir que data_contratacao seja uma data válida
        data_contratacao: new Date(dataToSend.data_contratacao).toISOString()
      };
      
      // Remover senha se estiver vazia
      if (!finalData.senha) {
        delete finalData.senha;
      }
      
      console.log('📤 Dados finais enviados para API:', finalData);

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });
      
      console.log('📡 Response status na edição:', response.status);
      console.log('📡 Response ok na edição:', response.ok);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Colaborador editado com sucesso:', responseData);
        fetchCollaborators();
        setError(null); // Limpar erro em caso de sucesso
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro HTTP na edição:', response.status, errorData);
        
        if (response.status === 401) {
          setError('Token expirado ou inválido. Faça login novamente.');
        } else if (response.status === 400) {
          setError(`Erro de validação: ${errorData.message || 'Dados inválidos'}`);
        } else if (response.status === 403) {
          setError('Você não tem permissão para realizar esta ação');
        } else if (response.status === 404) {
          setError('Colaborador não encontrado');
        } else {
          setError(`Erro ao editar colaborador: ${errorData.message || 'Erro desconhecido'}`);
        }
      }
    } catch (error) {
      console.error('❌ Erro na requisição de edição:', error);
      setError(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleRemoveCollaborator = async (id: number) => {
    // Verificar role do usuário atual
    const userRole = localStorage.getItem('role');
    console.log('👤 Role do usuário atual:', userRole);
    console.log('🔍 É admin?', userRole === 'admin');
    
    // Confirmação antes de remover
    const collaborator = collaborators.find(c => c.id === id);
    const confirmMessage = `Tem certeza que deseja remover ${collaborator?.nome || 'este colaborador'}?`;
    
    if (!window.confirm(confirmMessage)) {
      console.log('❌ Remoção cancelada pelo usuário');
      return;
    }

    console.log('🗑️ Iniciando remoção do colaborador:', id);
    console.log('📊 Colaborador encontrado:', collaborator);
    setError(null); // Limpar erros anteriores
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔐 Token encontrado para remoção:', !!token);
      console.log('🔐 Token (primeiros 20 chars):', token?.substring(0, 20) + '...');
      
      if (!token) {
        console.log('❌ Token não encontrado!');
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      const url = `${API_URL}/${id}`;
      console.log('🌐 URL da requisição:', url);
      console.log('📤 Método: DELETE');
      console.log('📤 Headers:', {
        'Authorization': `Bearer ${token?.substring(0, 20)}...`,
        'Content-Type': 'application/json',
      });

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status na remoção:', response.status);
      console.log('📡 Response ok na remoção:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Tentar ler a resposta como texto primeiro para debug
      const responseText = await response.text();
      console.log('📡 Response text:', responseText);
      
      let responseData: any = {};
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        console.log('📡 Response JSON:', responseData);
      } catch (parseError) {
        console.log('⚠️ Erro ao parsear JSON da resposta:', parseError);
      }
      
      if (response.ok) {
        console.log('✅ Colaborador removido com sucesso:', responseData);
        console.log('🔄 Recarregando lista de colaboradores...');
        await fetchCollaborators(); // Recarregar lista
        setError(null);
        console.log('✅ Lista recarregada com sucesso');
      } else {
        console.error('❌ Erro HTTP na remoção:', response.status, responseData);
        
        if (response.status === 401) {
          setError('Token expirado ou inválido. Faça login novamente.');
        } else if (response.status === 403) {
          setError('Você não tem permissão para remover colaboradores');
        } else if (response.status === 404) {
          setError('Colaborador não encontrado');
        } else {
          setError(`Erro ao remover colaborador: ${responseData?.message || responseData?.error || 'Erro desconhecido'}`);
        }
      }
    } catch (error: any) {
      console.error('❌ Erro na requisição de remoção:', error);
      console.error('❌ Stack trace:', error?.stack);
      setError(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const openEditPopup = (collaborator: CollaboratorFromAPI) => {
    setCurrentCollaborator(collaborator);
    setIsEditPopupOpen(true);
  };

  // Verificar se o usuário atual é admin
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';

  return (
    <div id='manager-page' className='flex-center flex-column flex__justify-start flex__gap-30 padding-50 min-height-100vh'>
      <h1>Colaboradores</h1>
      
      {!isAdmin && (
        <div style={{ 
          color: '#ff8c00', 
          background: '#fff3cd', 
          padding: '10px', 
          borderRadius: '5px',
          border: '1px solid #ffeaa7',
          marginBottom: '20px'
        }}>
          ⚠️ Aviso: Apenas administradores podem remover colaboradores
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: 'red', 
          background: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '5px',
          border: '1px solid #ff0000',
          marginBottom: '20px'
        }}>
          ❌ Erro: {error}
        </div>
      )}
      
      <div className="collaborators-section">
        <button 
          className="add-button"
          onClick={() => setIsRegisterPopupOpen(true)}
        >
          Adicionar Colaborador
        </button>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            🔄 Carregando colaboradores...
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>CPF</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Data</th>
                <th>Role</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {collaborators.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>
                    {error ? '❌ Erro ao carregar dados' : '📭 Nenhum colaborador encontrado'}
                  </td>
                </tr>
              ) : (
                collaborators.map((collab) => (
                  <tr key={collab.id}>
                    <td>{collab.id}</td>
                    <td>{collab.nome}</td>
                    <td>{collab.email}</td>
                    <td>{formatCPF(collab.cpf)}</td>
                    <td>{collab.cargo}</td>
                    <td>{collab.departamento}</td>
                    <td>{new Date(collab.data_contratacao).toLocaleDateString()}</td>
                    <td>{collab.role}</td>
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
                        disabled={!isAdmin}
                        style={{
                          opacity: isAdmin ? 1 : 0.5,
                          cursor: isAdmin ? 'pointer' : 'not-allowed'
                        }}
                        title={isAdmin ? 'Remover colaborador' : 'Apenas administradores podem remover colaboradores'}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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
