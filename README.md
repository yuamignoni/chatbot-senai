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

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone git@github.com:AbilioGamaNetoJ/chatbot-senai.git
cd chatbot-senai
```

### 2. Configuração do Backend

```bash
# Navegue para a pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env com suas configurações
# DATABASE_URL="postgresql://postgres:password@localhost:5432/hr_management"
# JWT_SECRET="seu-jwt-secret-super-seguro"
```

### 3. Configuração do Frontend

```bash
# Navegue para a pasta do frontend (em outro terminal)
cd frontend

# Instale as dependências
npm install
```

## 🚀 Executando a Aplicação

### Opção 1: Usando Docker (Recomendado)

```bash
# Na pasta backend, execute:
cd backend

# Inicie os serviços (PostgreSQL + API)
npm run docker:up

# Para ver os logs
npm run docker:logs

# Para parar os serviços
npm run docker:down
```

### Opção 2: Executando Localmente

#### Backend
```bash
cd backend

# Inicie apenas o PostgreSQL via Docker
docker-compose up postgres -d

# Execute as migrações do banco
npm run migrate

# Execute o seed (dados iniciais)
npm run seed

# Inicie o servidor em modo desenvolvimento
npm run dev
```

O backend estará rodando em: `http://localhost:3000`

#### Frontend
```bash
cd frontend

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

## 📊 Banco de Dados

A aplicação utiliza PostgreSQL com as seguintes tabelas principais:

- **Funcionario** - Dados dos colaboradores
- **RegistroPonto** - Controle de ponto eletrônico
- **SolicitacaoFerias** - Solicitações de férias
- **Salario** - Histórico salarial
- **Holerite** - Holerites dos funcionários
- **Beneficio** - Benefícios disponíveis
- **FuncionarioBeneficio** - Relação funcionário-benefício

### Comandos úteis do Prisma

```bash
# Visualizar o banco via Prisma Studio
npm run studio

# Gerar o cliente Prisma após alterações no schema
npm run generate

# Executar migrações
npm run migrate
```

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

- Autenticação JWT com refresh tokens
- Senhas criptografadas com bcrypt
- Validação de dados com Joi
- Rate limiting
- Helmet para headers de segurança
- CORS configurado
