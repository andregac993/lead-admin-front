# Lead Admin Front

Dashboard administrativo para gerenciamento de leads de landing pages.

## 📝 Notas

- O projeto requer uma API backend rodando (configure em `.env.local`)
- Usa Turbopack para builds mais rápidos
- Componentes UI baseados em shadcn/ui com Radix UI
- **⚠️ Criação de Landing Pages:** Ainda não há interface para criar landing pages. Use a API diretamente via Postman ou outra ferramenta para criar novas landing pages no backend.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **NextAuth.js v5** - Autenticação
- **TanStack Query** - Gerenciamento de estado servidor
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Componentes acessíveis
- **React Hook Form + Zod** - Formulários e validação
- **Biome** - Linter e formatter
- **Lucide React** - Ícones

## 📋 Funcionalidades

- Autenticação (login/signup)
- Dashboard com métricas
- Gerenciamento de Landing Pages
- CRUD completo de Leads
- Busca e filtros de leads
- Exportação de leads
- Gerenciamento de API Keys

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
# NextAuth
AUTH_SECRET=sua-chave-secreta-aqui
# Para gerar: openssl rand -base64 32
```

### 2. Instalação

```bash
npm install
```

## 🏃 Rodando o Projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Build e Produção

```bash
npm run build
npm start
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev         # Inicia servidor de desenvolvimento
npm run build       # Build de produção
npm run start       # Inicia servidor de produção
npm run lint        # Verifica código com Biome
npm run lint:fix    # Corrige problemas automaticamente
npm run format      # Formata código
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Rotas de autenticação
│   └── (dashboard)/       # Rotas protegidas
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticação
│   ├── dashboard/        # Componentes do dashboard
│   ├── landing-pages/    # Componentes de landing pages
│   ├── leads/            # Componentes de leads
│   ├── shared/           # Componentes compartilhados
│   └── ui/               # Componentes base (shadcn/ui)
├── lib/
│   ├── server/           # Server actions
│   ├── validations/      # Schemas Zod
│   └── hooks/            # Custom hooks
└── types/                # Definições TypeScript
```



## 📝 Notas

- O projeto requer uma API backend rodando (configure em `.env.local`)
- Usa Turbopack para builds mais rápidos
- Componentes UI baseados em shadcn/ui com Radix UI
- **⚠️ Criação de Landing Pages:** Ainda não há interface para criar landing pages. Use a API diretamente via Postman ou outra ferramenta para criar novas landing pages no backend.
