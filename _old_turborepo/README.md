# KrikasBurguer SaaS + Evolution API

Sistema completo de cardápio digital, automação de pedidos e WhatsApp SaaS.

## Estrutura do Projeto

- `apps/api`: Backend NestJS
- `apps/web`: Frontend Next.js 15
- `packages/database`: Prisma & PostgreSQL
- `packages/types`: Tipagens compartilhadas

## Requisitos

- Node.js 20+
- Docker & Docker Compose

## Como começar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie a infraestrutura:**
   ```bash
   docker-compose up -d
   ```

3. **Gere o cliente Prisma:**
   ```bash
   npm run db:generate --workspace=@pedidoszap/database
   ```

4. **Inicie o desenvolvimento:**
   ```bash
   npm run dev
   ```

## Stack

- **Frontend:** Next.js, React, TailwindCSS, Framer Motion
- **Backend:** NestJS, Prisma, BullMQ, Socket.IO
- **Database:** PostgreSQL, Redis
- **WhatsApp:** Evolution API v2
