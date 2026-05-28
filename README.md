# Chatbot SENAI - Sistema de Gestão de Colaboradores

Este projeto foi desenvolvido para a Universidade UniSenai como parte do Projeto Aplicado V. É uma aplicação full stack que combina um sistema de gestão de colaboradores com um chatbot inteligente para auxiliar os funcionários a tirarem suas dúvidas sobre RH, benefícios, ponto eletrônico e muito mais.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca JavaScript para criação de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server ultra-rápido
- **React Router DOM** - Roteamento para aplicações React
- **Typebot.io** - Integração com chatbot
- **CSS3** - Estilização customizada

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web para Node.js
- **TypeScript** - Tipagem estática
- **Prisma** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **Bcrypt** - Criptografia de senhas
- **Docker** - Containerização

### Infraestrutura
- **Docker Compose** - Orquestração de containers
- **PostgreSQL 15** - Banco de dados em container

## 📋 Pré-requisitos

Antes de executar a aplicação, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com Node.js)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## 🛠️ Instalação e Execução

Para configurar e rodar a aplicação em seu ambiente de desenvolvimento, siga os passos abaixo. O uso de Docker é essencial para orquestrar os serviços.

### 1. Clone o Repositório
```bash
git clone git@github.com:AbilioGamaNetoJ/chatbot-senai.git
cd chatbot-senai
```

### 2. Configure as Variáveis de Ambiente (Opcional)

A aplicação já vem pré-configurada para o ambiente Docker. Caso precise customizar, você pode criar um arquivo `.env` na pasta `backend` a partir do `.env.example`.

### 3. Inicie os Serviços com Docker

Este comando irá construir as imagens e iniciar os contêineres do frontend, backend e do banco de dados PostgreSQL em segundo plano.

```bash
docker compose up -d
```

### 4. Instale as Dependências e Popule o Banco

Com os serviços rodando, execute o script `seed` para criar as tabelas e popular o banco de dados com dados de teste, incluindo o usuário administrador.

```bash
# Navegue até a pasta do backend
cd backend

# Instale as dependências (se for a primeira vez)
npm install

# Execute o seed
npm run seed
```

Após a conclusão do `seed`, a aplicação estará pronta para uso.

- **Frontend:** `http://localhost:8080`
- **Backend:** `http://localhost:3000`

### Usuário Administrador Padrão

O script de `seed` cria um usuário administrador para o primeiro acesso ao sistema. Utilize as seguintes credenciais:

- **Email:** `admin@empresa.com`
- **Senha:** `admin123`

## 🚀 Comandos Úteis

### Docker
```bash
# Iniciar todos os serviços em segundo plano
docker compose up -d

# Parar todos os serviços
docker compose down

# Visualizar logs dos serviços
docker compose logs -f

# Acessar o terminal de um serviço (ex: backend)
docker compose exec backend bash
```

### Prisma (Execute dentro da pasta `backend/`)
```bash
# Visualizar o banco via Prisma Studio
npm run studio

# Gerar o cliente Prisma após alterações no schema
npm run generate

# Criar e executar uma nova migração
npx prisma migrate dev --name nome-da-migration

# Executar o seed (popular o banco com dados iniciais)
npm run seed
```

## 📊 Banco de Dados

A aplicação utiliza PostgreSQL com as seguintes tabelas principais:

- **Funcionario** - Dados dos colaboradores
- **RegistroPonto** - Controle de ponto eletrônico
- **SolicitacaoFerias** - Solicitações de férias
- **Salario** - Histórico salarial
- **Holerite** - Holerites dos funcionários
- **Beneficio** - Benefícios disponíveis
- **FuncionarioBeneficio** - Relação funcionário-benefício

## 🤖 Funcionalidades do Chatbot

O chatbot integrado permite aos colaboradores:

- ✅ Consultar informações sobre benefícios
- ✅ Verificar saldo de férias
- ✅ Tirar dúvidas sobre ponto eletrônico
- ✅ Acessar informações de RH
- ✅ Obter suporte para procedimentos internos
- ✅ Consultar políticas da empresa

## 👥 Funcionalidades do Sistema

### Para Funcionários
- Login seguro com JWT
- Visualização de dados pessoais
- Consulta de holerites
- Solicitação de férias
- Registro de ponto
- Chat com IA para dúvidas

### Para Gestores
- Gerenciamento de colaboradores
- Aprovação de solicitações
- Relatórios de RH
- Administração de benefícios

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Servidor em modo desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
npm run migrate      # Executar migrações
npm run seed         # Popular banco com dados iniciais
npm run studio       # Abrir Prisma Studio
npm run lint         # Executar linter
npm run docker:up    # Subir containers
npm run docker:down  # Parar containers
```

### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executar linter
```

## 🏗️ Estrutura do Projeto

```
chatbot-senai/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── middleware/      # Middlewares (auth, validation)
│   │   ├── routes/         # Rotas da API
│   │   ├── config/         # Configurações (DB, JWT)
│   │   └── utils/          # Utilitários
│   ├── prisma/             # Schema e seeds do banco
│   └── docker-compose.yml  # Configuração Docker
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── styles/        # Arquivos CSS
│   │   └── assets/        # Imagens e recursos
│   └── package.json
└── README.md
```

## 🔐 Segurança

- Autenticação JWT
- Senhas criptografadas com bcrypt
- Validação de dados com Joi
- Rate limiting
- Helmet para headers de segurança
- CORS configurado
