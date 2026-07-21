# </> DevBlog — Back-end

API RESTful desenvolvida com **Node.js**, **Express** e **TypeScript**, utilizando **MySQL** como banco de dados relacional. Este projeto foi construído como parte do processo seletivo (Case de Estágio em Desenvolvimento) da **Mind Group**.

A proposta da DevBlog API é fornecer toda a estrutura de back-end para um blog: autenticação de usuários, gerenciamento de posts e upload de imagens, seguindo boas práticas de arquitetura, segurança e documentação.

## 👩‍💻 Desenvolvedora

Desenvolvida por * **Amanda Mayumi** ([Amand4May](https://github.com/Amand4May)) para o processo seletivo da **Mind Group**.

---

## 📑 Sumário

- [Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#️-pré-requisitos)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Documentação da API (Swagger)](#-documentação-da-api-swagger)
- [Estrutura do Projeto (MVC)](#-estrutura-do-projeto-mvc)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Desenvolvedora](#️-desenvolvedora)

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| **Node.js & Express** | Construção da API e roteamento das requisições |
| **TypeScript** | Tipagem estática, mais segurança e legibilidade no código |
| **MySQL** | Banco de dados relacional para persistência das informações |
| **Docker & Docker Compose** | Containerização e padronização do ambiente de desenvolvimento |
| **JWT (JSON Web Token)** | Autenticação e controle de acesso às rotas protegidas |
| **Bcrypt** | Criptografia e hash seguro de senhas |
| **Multer** | Upload e gerenciamento de imagens |
| **Swagger** | Documentação interativa e testável da API |

---

## ✨ Funcionalidades

- 🔐 Cadastro e autenticação de usuários com JWT
- 📝 CRUD completo de posts do blog
- 🖼️ Upload de imagens para os posts
- 📄 Documentação interativa via Swagger
- 🐳 Ambiente de banco de dados pronto via Docker Compose

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) — versão **18 ou superior** (recomendado)
- [Docker e Docker Compose](https://www.docker.com/) — caso vá rodar o banco de dados via container
- [Git](https://git-scm.com/) — para clonar o repositório

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/Amand4May/devblog-back-novo
cd devblog-back-novo
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, baseando-se no modelo abaixo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=devblog
JWT_SECRET=sua_chave_secreta_aqui
```

> ⚠️ Nunca suba o arquivo `.env` para o repositório!!!

### 4. Subir o banco de dados com Docker

Para facilitar a configuração do banco e já carregar a estrutura inicial, utilize o Docker Compose incluso no projeto:

```bash
docker-compose up -d
```

Esse comando vai:
- Subir uma instância do **MySQL** na porta `3306`;
- Importar automaticamente o dump (estrutura + dados iniciais) contido no repositório.

Para verificar se o container está rodando corretamente:

```bash
docker ps
```

### 5. Executar a aplicação

Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Se tudo estiver correto, você verá uma mensagem confirmando que o servidor está rodando. A API estará disponível em:

```
http://localhost:3000
```

---

## 📚 Documentação da API (Swagger)

Com a API em execução, é possível acessar a documentação interativa para consultar e testar todas as rotas diretamente pelo navegador:

```
http://localhost:3000/api-docs
```

Por lá é possível ver os endpoints disponíveis, os parâmetros esperados, os modelos de request/response e testar as chamadas sem precisar de um cliente externo (como Postman ou Insomnia).

---

## 📦 Estrutura do Projeto (MVC)

O projeto segue o padrão arquitetural **MVC (Model-View-Controller)**, adaptado ao contexto de uma API REST, garantindo maior modularidade, separação de responsabilidades e legibilidade do código:

```
src/
├── controllers/    # Regras de negócio das requisições
├── routes/         # Mapeamento das rotas da API e integração com o Swagger
├── middlewares/    # Middlewares de autenticação (JWT) e upload de arquivos
├── database/       # Conexão e configuração do banco de dados MySQL
```

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor em modo de desenvolvimento (com hot reload) |
| `npm run build` | Compila o projeto TypeScript para JavaScript |
| `npm start` | Executa a versão compilada do projeto |

---
