# Daily Diet API

API RESTful para controle de dieta diária, permitindo o cadastro de usuários, registro de refeições e acompanhamento de métricas.

## ✨ Funcionalidades

- **Cadastro de Usuários**: Permite a criação de novos usuários. A identificação é feita através de um `sessionId` armazenado em cookies.
- **CRUD de Refeições**:
  - **Criar**: Registrar uma nova refeição com nome, descrição, data e se está ou não dentro da dieta.
  - **Listar**: Visualizar todas as refeições de um usuário.
  - **Visualizar**: Obter os detalhes de uma única refeição.
  - **Atualizar**: Editar as informações de uma refeição existente.
  - **Deletar**: Remover uma refeição.
- **Métricas do Usuário**:
  - Quantidade total de refeições registradas.
  - Quantidade de refeições dentro da dieta.
  - Quantidade de refeições fora da dieta.
  - Melhor sequência de refeições dentro da dieta.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Fastify**: Framework web focado em performance e baixo overhead.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Knex.js**: Query builder SQL para Node.js, compatível com múltiplos bancos de dados (configurado para SQLite e PostgreSQL).
- **Zod**: Biblioteca para validação de esquemas de dados.
- **Vitest**: Framework de testes unitários e de integração.
- **Supertest**: Biblioteca para testar APIs HTTP.
- **TSX**: Executa arquivos TypeScript e ESM diretamente no Node.js.
- **tsup**: Ferramenta para build de pacotes TypeScript.
- **ESLint**: Ferramenta para linting de código, garantindo a consistência e qualidade.

## 💻 Como Começar

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Um gerenciador de pacotes como npm, yarn ou pnpm

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/Vitinho163/Daily-Diet-API.git
    ```

2.  Navegue até o diretório do projeto:
    ```bash
    cd Daily-Diet-API
    ```

3.  Instale as dependências:
    ```bash
    npm install
    ```

4.  Crie uma cópia do arquivo de variáveis de ambiente e preencha com suas configurações:
    ```bash
    cp .env.example .env
    ```
    O arquivo `.env` será parecido com isto:
    ```env
    NODE_ENV="development"
    DATABASE_CLIENT=sqlite
    DATABASE_URL="./db/app.db"
    PORT=3333
    ```

5.  Execute as migrações do banco de dados para criar as tabelas necessárias:
    ```bash
    npm run knex migrate:latest
    ```

### Executando a Aplicação

Para iniciar o servidor em modo de desenvolvimento com hot-reload:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento.
- `npm run knex -- <comando>`: Executa comandos do Knex.js (ex: `npm run knex -- migrate:make create-users`).
- `npm run lint`: Executa o ESLint para análise estática do código.
- `npm run build`: Compila o código TypeScript para JavaScript (na pasta `build`).
- `npm run test`: Executa a suíte de testes de integração com o Vitest.

## 🌐 Endpoints da API

### Usuários

| Método | Rota      | Descrição           |
| :----- | :-------- | :------------------ |
| `POST` | `/users`  | Cria um novo usuário. |

**Corpo da Requisição (POST /users):**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com"
}
```

### Refeições

| Método   | Rota             | Descrição                               |
| :------- | :--------------- | :-------------------------------------- |
| `POST`   | `/meals`         | Cria uma nova refeição para o usuário.  |
| `GET`    | `/meals`         | Lista todas as refeições do usuário.    |
| `GET`    | `/meals/:id`     | Obtém os detalhes de uma refeição.      |
| `PUT`    | `/meals/:id`     | Atualiza uma refeição.                  |
| `DELETE` | `/meals/:id`     | Deleta uma refeição.                    |
| `GET`    | `/meals/summary` | Obtém as métricas de refeições do usuário. |

**Corpo da Requisição (POST /meals, PUT /meals/:id):**
```json
{
  "name": "Café da Manhã",
  "description": "Pão integral com ovos.",
  "isOnDiet": true,
  "date": "2025-08-16T08:00:00.000Z"
}
```
> **Nota:** Todas as rotas de refeições (`/meals`) são protegidas e exigem que o `sessionId` do usuário seja enviado nos cookies da requisição.