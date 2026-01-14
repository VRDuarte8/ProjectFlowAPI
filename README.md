# ProjectFlow API
API REST para gerenciamento de projetos e tarefas, com autenticação de usuários.
Permite criar projetos, associar tarefas e controlar status de execução.

## 🛠 Tecnologias
- Node.js
- TypeScript
- Express
- MongoDB
- JWT (Autenticação)
- Mongoose
- Zod (validação)

## 🚀 Como rodar o projeto

### Clone o repositório
```bash
git clone https://github.com/seu-user/projectflow-api
```

### Instale as dependências
```bash
npm install
```

### Crie o arquivo .env
```bash
cp .env.example .env
```

### Rode o projeto
```bash
npm run dev
```

E no `.env.example`:
```env
PORT=3333
MONGO_URI=mongodb://localhost:27017/projectflow
JWT_SECRET=sua_chave_secreta
```

## 🔐 Autenticação
A API utiliza autenticação JWT.
Após o login, o token deve ser enviado no header:
```http
Authorization: Bearer <token>
```

## 🧪 Testes
Este projeto possui testes de integração utilizando **Jest** e **Supertest**,
cobrindo os principais fluxos da aplicação.

### Testes implementados:
- Registro e login de usuários (JWT)
- Criação de projetos com autenticação
- Controle de acesso: usuário não membro não pode criar tarefas (403)

### Rodando os testes localmente

```bash
npm test
```

## 📌 Endpoints

### 👤 Users
POST /users/register - Cria um novo usuário

Body
```json
{
  "name": "Vinicius",
  "email": "vinicius@email.com",
  "password": "123456",
  "role": "dev"
}

{
  "id": "64abc...",
  "name": "Vinicius",
  "email": "vinicius@email.com"
}
```


POST /api/users/login - Autentica usuário
Body
```json
{
  "email": "vinicius@email.com",
  "password": "123456"
}
```

Response
```json
{
  "token": "jwt.token.aqui"
}
```


GET /api/users/profile - Retorna usuário autenticado


GET /api/users/:id - Retorna um usuário pelo id


DELETE /api/users/:id - Deleta um usuário


PUT /api/users/:id - Atualiza um usuário


### 📁 Projects
POST /projects/create - Cria um projeto

Body
```json
{
  "name": "Projeto API",
  "description": "Gerenciar tarefas",
  "members": [
    "member.id1",
    "member,id2",
    ...
  ]
}
```

GET /api/projects/:id  - Retorna um projeto


GET /api/projects/ - Retorna projetos do usuário autenticado


DELETE /api/projects/:id - Deleta um projeto


PUT /api/projects/:id - Atualiza um projeto


GET /api/projects/report - Retorna um relatório do projeto contendo total de tarefas, total por status, atrasadas e constribuidores


### ✅ Tasks
POST /api/tasks/create - Cria tarefa vinculada a um projeto

Body
```json
{
  "title": "Criar autenticação",
  "description": "Criar autenticação com JWT",
  "status": "PENDENTE",
  "priority": "BAIXA",
  "projectId": "project.id",
  "assignedTo": "user.id",
  "dueDate": "2026-01-20"
}
```

**Status possíveis:**
- `PENDENTE`
- `EM_ANDAMENTO`
- `CONCLUIDA`

**Prioridades possíveis:**
- `BAIXA`
- `MEDIA`
- `ALTA`

GET /api/tasks/ - Lista tarefas do usuário autenticado

GET /api/tasks/project/:id - Lista tarefas de um projeto

DELETE /api/tasks/:id - Deleta uma task

PUT /api/tasks/:id  - Atualiza uma task


## 📬 Postman Collection
A collection do Postman está disponível na pasta:
/docs/ProjectFlow API.postman_collection.json

Importe o arquivo no Postman para testar todos os endpoints da API.


## 👨‍💻 Autor
Vinicius Duarte

Desenvolvedor Back-end Node.js
