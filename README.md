# Gerenciador de Candidaturas (Job Application Manager)

Este é um projeto Full Stack desenvolvido para auxiliar no gerenciamento de candidaturas a vagas de emprego. A aplicação permite que usuários se cadastrem, façam login e organizem suas aplicações, incluindo status.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** (Vite)
- **TypeScript**
- **Tailwind CSS 4**
- **Radix UI** (Componentes acessíveis: Dialog, Popover, Separator, etc.)
- **React Hook Form** + **Zod** (Gerenciamento e validação de formulários)
- **Axios** (Requisições HTTP)
- **Lucide React** (Ícones)

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB** (com Mongoose)
- **JWT** (JSON Web Token para autenticação)
- **Bcrypt** (Hashing de senhas)
- **Zod** (Validação de dados)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão LTS recomendada)
- [Git](https://git-scm.com/)
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ou uma instância local do MongoDB.

## 🔧 Instalação e Configuração

Clone este repositório:

```bash
git clone https://github.com/pedrolgr/gerenciador-candidaturas.git
cd gerenciador-candidaturas
```

### 1. Configurando o Backend

Navegue até a pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:

```env
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_jwt
```

- **MONGO_URI**: String de conexão do seu banco de dados MongoDB.
- **JWT_SECRET**: Uma string aleatória e segura para assinar os tokens de autenticação.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor backend iniciará na porta `3000`.

### 2. Configurando o Frontend

Abra um novo terminal, navegue até a pasta do frontend e instale as dependências:

```bash
cd frontend
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend geralmente iniciará na porta `5173` (ou outra disponível indicada no terminal).

## 💻 Rotas da Aplicação (Frontend)

URLs acessíveis pelo navegador:

- `/signin` - Página de Login.
- `/signup` - Página de Cadastro.
- `/jobdashboard` - Painel de controle de candidaturas (Requer login).

## 🖥️ Utilização

1. Abra o navegador e acesse `http://localhost:5173`.
2. Crie uma nova conta na página de registro.
3. Faça login com suas credenciais.
4. No Dashboard, você poderá adicionar novas candidaturas, visualizar as existentes e gerenciar seu progresso.

## 📂 Estrutura do Projeto

```
gerenciador-candidaturas/
├── backend/                # API e lógica do servidor
│   ├── controllers/        # Controladores das rotas
│   ├── models/             # Modelos do Mongoose
│   ├── services/           # Regras de negócio
│   ├── index.ts            # Ponto de entrada do servidor
│   └── ...
├── frontend/               # Interface do usuário (React)
│   ├── src/
│   │   ├── routes/         # Páginas e rotas da aplicação
│   │   ├── components/     # Componentes reutilizáveis
│   │   └── ...
│   └── ...
└── ...
```

## 📝 Observações

- O backend está configurado para rodar na porta `3000`.
- O frontend faz requisições para `http://localhost:3000`. Caso altere a porta do backend, lembre-se de atualizar as chamadas no frontend.
- O CORS no backend está configurado para aceitar requisições de `http://localhost:5173`.
