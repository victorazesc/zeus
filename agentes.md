# Zeus 2 – Contexto para agentes

## Visão geral
- **Propósito:** plataforma multiempresas focada em gestão de propostas, clientes, produtos e serviços para um `workspace` selecionado; usuários precisam estar autenticados e ter um `lastWorkspaceId` ativo para acessar dados.
- **Stack principal:** Next.js 14 (App Router) + React 18, TypeScript estrito, TailwindCSS/shadcn-ui, MobX para estado global, SWR como camada de revalidação, Prisma + PostgreSQL nos handlers `app/api`, autenticação via JWT e cookies, UploadThing e AWS S3 para arquivos, Sonner para toasts.
- **Fluxo de alto nível:**
  1. Usuário faz login (senha, OTP ou Google OAuth). Tokens são emitidos (`getTokens`) e gravados via `AuthService` (`js-cookie`).
  2. `StoreProvider` inicializa `RootStore`; `StoreWrapper` injeta params da rota; `UserAuthWrapper` e `WorkspaceWrapper` obtêm usuário/workspaces via SWR + stores.
  3. Páginas sob `(workspace)/[workspaceSlug]` usam serviços (`CustomerService`, `ProductService`, etc.) para consumir os endpoints `app/api/**`, que delegam para ações Prisma em `actions/*.action.ts` filtrando por `currentUser.lastWorkspaceId`.
  4. Formularios usam React Hook Form + Zod para validar e persistir dados, exibindo feedback com Sonner.

## Módulos e cobertura atual
- **Autenticação / Contas (🔥 Alta):** fluxo completo de login (senha, OTP, Google), criação automática de usuários sociais, gerenciamento de tokens JWT em `AuthService`; multiempresa atendida via `workspaces` + `lastWorkspaceId`, onboarding e tela dedicada de criação de workspace (`/create-workspace`), convites com papéis básicos (`admin`, `manager`, `collaborator`) enviados por e-mail com aceitação automática no primeiro login.
- **Dashboard principal (🔥 Alta):** tela inicial `/(workspace)/[workspaceSlug]/page.tsx` exibe saudações e estrutura para cards; métricas de finanças/vendas/tarefas ainda pendentes.
- **Clientes e Fornecedores (🔥 Alta):** módulo de clientes completo (CRUD, histórico via tabelas, campos para contato e documentos). Fornecedores podem ser modelados via flag `supplier` na tabela `Customer`, mas UI dedicada ainda não existe.
- **Produtos e Estoque (🔥 Alta):** cadastro de produtos com estoque, custo, preço e margem; tabela com busca e edição; controle de estoque mínimo e alertas ainda não implementados.
- **Vendas e Faturamento (🔥 Alta):** propostas servem como MVP de pedidos/faturamento (seleção de produtos/serviços, cálculo de valor/lucro, edição já funcional). Emissão de notas fiscais ou fluxo de faturamento manual ainda não disponível.
- **Financeiro básico (🔥 Alta):** contas a pagar/receber, fluxo de caixa e conciliação não foram implementados; requer novo domínio.
- **Relatórios (⚙️ Média):** não há dashboards agregados; necessária implementação de endpoints e UI para resumo mensal de vendas/despesas/lucros.
- **Usuários / Permissões (⚙️ Média):** convites multi-usuário com papéis armazenados, porém não há enforcement granular de permissões nas telas/API; requer política de acesso baseada em função.

## Inicialização e comandos
- **Pré-requisitos:** Node 18+, Yarn classic (1.x), banco PostgreSQL com URLs definidas em `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING`.
- **Variáveis de ambiente relevantes:**
  - `NEXT_PUBLIC_API_BASE_URL` (usada pelos serviços cliente).
  - `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` (JWT).
  - `GOOGLE_CLIENT_ID` (OAuth), `SMTP_HOST/PORT/USER/PASS` (e-mail), `AWS_REGION/AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY/S3_BUCKET_NAME` (upload S3).
  - `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID` se UploadThing for habilitado.
- **Scripts:** `yarn dev`, `yarn build` (executa `prisma generate` + `next build`), `yarn start`, `yarn lint` (pede scaffold interativo se `.eslintrc` não existir), `yarn tsc --noEmit` (verificação de tipos usada para garantir saúde da base).

## Estrutura de diretórios
- `app/`: rotas App Router.
  - `(auth)` (login, OTP, reset), `(onboarding)` (wizard), `(root)` (redireciona para `/sign-in`), `(workspace)` (shell autenticado) e `api/` (handlers REST/UploadThing).
- `actions/`: camada server-side com Prisma (`schema.prisma`) e integrações (auth, workspace, propostas, uploads).
- `components/`: UI segmentada por domínio (`customer`, `product`, `proposal`, etc.), includes generics (`shared/data-tables.tsx` usa TanStack Table).
- `constants/`: textos/botões (`empty-state`), enums (status de propostas), menus (`SIDEBAR_MENU_ITEMS`).
- `contexts/`: provê `StoreContext` com o `RootStore` MobX.
- `helpers/`: utilidades (`normalizeAccents`, máscaras, `API_BASE_URL`).
- `hooks/`: wrappers para stores (`useUser`, `useWorkspace`, etc.) e hooks utilitários (OTP, timers).
- `lib/`: provedores (`app-provider`, `store-wrapper`, `workspace-wrapper`), helpers (`jwt`, `auth`, `uploadthing`, `nodemailer`, instância Prisma).
- `services/`: clients HTTP (`APIService` base) para consumo dos endpoints `/api/**`.
- `store/`: stores MobX (user, workspace, aplicação/router, product, service) + helpers `use*StoreWithSWR` que conciliam MobX + SWR.
- `types/`: d.ts com modelos (user, workspace, proposal, etc.).

## Layout, rotas e navegação
- `app/layout.tsx` envolve toda a aplicação com `ThemeProvider`, `StoreProvider`, `AppProvider` (SWR + Toaster) e configura `SITE_TITLE` (ver `constants/seo-variables`).
- `(auth)/layout.tsx` renderiza branding com toasts; páginas: `sign-in`, `forgot-password`, `reset-password` (wizard multi-etapas em `components/forms`).
- `(workspace)/layout.tsx` envolve páginas autenticadas com `UserAuthWrapper` e `WorkspaceWrapper`; `app/(workspace)/app-layout.tsx` é a variante que inclui `AppSidebar` (uso nas páginas).
- `(workspace)/[workspaceSlug]/` contém:
  - `page.tsx`: dashboard inicial (`WorkspaceDashboardHeader`, `UserGreetingsView`).
  - `customers/page.tsx`, `products/page.tsx`, `services/page.tsx`, `proposals/page.tsx`: cada uma injeta cabeçalho (`components/headers/*`), usa `DataTable`, modais de adicionar/editar com hooks de busca e atualiza via SWR/serviços.

## Estado global
- `RootStore` agrega:
  - `AppRootStore` (`router.store` mantém query params → `workspaceSlug`, etc.; `app-config.store` placeholder).
  - `WorkspaceRootStore`: guarda cache de `workspaces` (`fetchWorkspaces` puxa `/api/users/me/workspaces/`, calcula `currentWorkspace`, sincroniza slug via `RouterStore`).
  - `UserRootStore`: controla `currentUser`, status de login, atualizações (`updateCurrentUser` chama `/api/users/me/`).
  - `ProductRootStore` e `ServiceRootStore`: listas + loaders; expostos via `useProductStoreWithSWR` / `useServiceStoreWithSWR` para sincronizar com SWR.
- `StoreWrapper` (lib) lê `useParams` e injeta no `RouterStore`; `UserAuthWrapper` usa SWR para `fetchCurrentUser` e garante redirecionamento ao `/sign-in` em caso de erro; `WorkspaceWrapper` garante que o slug da URL corresponde ao `lastWorkspaceId` e atualiza o usuário se necessário.

## Camada de dados (cliente)
- `APIService` centraliza chamadas axios e manipula cookies (`js-cookie`).
- Serviços especializados (`CustomerService`, `ProductService`, `ServiceService`, `ProposalService`, `WorkspaceService`, `InvitationService`, `AuthService`, etc.) constroem endpoints REST (`/api/...`).
- Formulários combinam React Hook Form + Zod (e.g. `components/proposal/add/dialog.tsx`, `components/customer/add/dialog.tsx`).
- Busca e filtros: `DataTable` (TanStack) suporta `searchFields` e normaliza strings com acentuação removida; `EmptyState` sem dados usa cópias de `constants/empty-state`.

## Camada de dados (servidor)
- `app/api/**` usa handlers App Router; cada rota delega a um arquivo em `actions/`.
  - **Autenticação:** `auth.action.ts` (Google OAuth via `google-auth-library`, senha/OTP, revalidação de token), `notify.action.ts` (OTP/reset e-mail com Nodemailer + Redis KV), `lib/jwt.ts` (assina/valida tokens usando secrets `.env`).
  - **Usuário:** `user.action.ts` expõe `getMe` (via header `Authorization: Bearer <token>`), atualiza `lastWorkspaceId`, `setPassword`, `retrieveUserSettings`.
  - **Workspace:** `workspace.action.ts` cria/atualiza workspaces, garante endereço via transação Prisma, ressincroniza tokens (`reSignIn`).
  - **Convites:** `invitation.action.ts` cria, lista e revoga convites de workspace validando o slug e a posse do usuário autenticado.
  - **Domínios:** `customer.action.ts`, `product.action.ts`, `service.action.ts`, `proposal.action.ts` fazem CRUD filtrando por `currentUser.lastWorkspaceId` e manipulam relações (ex.: `createProposal` cria registros em `ProposalProduct`/`ProposalService`).
  - **Upload:** `file.action.ts` envia para AWS S3; `uploadthing` rotea uploads server-side.
- `schema.prisma` modela `User`, `Workspace`, `Customer`, `Product`, `Service`, `Proposal`, `ProposalProduct`, `ProposalService`, `WorkspaceInvitation`, `WorkspaceMember` com relacionamentos necessários.

## Autenticação e sessões
- Cookies `accessToken`/`refreshToken` são armazenados no cliente via `AuthService`; requisições subsequentes aos serviços backend carregam `Authorization: Bearer` automaticamente.
- Handlers em `app/api` validam header via `verifyJwt` (usa `ACCESS_TOKEN_SECRET`) e recuperam o usuário com `prisma.user`.
- Fluxos suportados: senha (`/api/auth/sign-in`), OTP (`/api/auth/magic-sign-in` + KV), Google OAuth (`/api/auth/social`), redefinição via e-mail (`/api/auth/forgot-password`).
- `WorkspaceWrapper` garante que usuários sem `currentWorkspace` sejam redirecionados e que `lastWorkspaceId` seja atualizado ao navegar entre workspaces.

## UI e componentes de destaque
- **Sidebar:** `components/shared/app-sidebar.tsx` usa itens de `constants/common.ts` (Home, Clientes, Produtos, Serviços, Propostas, Financeiro).
- **Tabelas:** `components/shared/data-tables.tsx` trata carregamento (`Skeleton`), busca por campos nested (`customer.name`, etc.), e fallback com `EmptyState`.
- **Modais:** `components/*/add/dialog.tsx` e `.../update/dialog.tsx` compartilham padrões (controle híbrido via `isOpen` prop + estado interno, reset de formulários, `on*Added` para revalidar).
- **Pickers:** `components/shared/user-picker`, `status-picker`, `date-picker`, `product/service` multi-selects alimentados pelos serviços correspondentes.
- **Feedback:** `sonner` (`Toaster richColors`) em `app-provider` + `Workspace` side wrappers.

## Integrações externas
- **Banco:** PostgreSQL via Prisma Client (`lib/prisma.ts`). Desenvolvimento reaproveita instância guardada em `global`.
- **Cache/Eventos:** Redis KV (via `@vercel/kv`) para OTP / magic link.
- **Upload:** UploadThing (`lib/uploadthing.ts` + `app/api/uploadthing`), AWS S3 fallback (`file.action.ts`).
- **Google OAuth:** `google-auth-library` com `GOOGLE_CLIENT_ID`.
- **E-mail:** Nodemailer com autenticação SMTP para OTP/reset.
- **Formatadores:** máscaras de CEP/telefone/documento em `helpers/common.helper.ts`; `viacep` é consumido diretamente no cliente para auto-preenchimento.

## Tipos e modelos relevantes
- `types/proposal.d.ts`: define shape usado no front (`customer`/`user` parciais, arrays de produtos/serviços).
- `types/user.d.ts`: `IUserSettings`, etapas de onboarding.
- `types/workspace.d.ts`: ainda referencia tipos do projeto Plane; apenas subconjunto é usado (e pode conter propriedades não alinhadas ao schema atual).
- `constants/proposal-status.ts`: mapa `Status` → `label`, `icon`, `color` (usado na lista de propostas).

## Qualidade e verificações
- **Lint:** `yarn lint` dispara `next lint`; atualmente pede escolha de configuração (não commitado). Se você rodar manualmente, selecione `Strict` uma vez e confirme `.eslintrc` gerado.
- **Types:** `yarn tsc --noEmit` é o cheque automático (há `strict: true`).
- **Tests:** não há testes automatizados; any validação adicional precisa ser construída.

## Pontos de atenção / lacunas observadas
- Tipagem do workspace reutiliza tipos externos (`@plane/types`) que não existem neste repo; revisar se ainda são necessários.
- `app/(workspace)/layout.tsx` não inclui o `AppSidebar`, enquanto as páginas usam `../../app-layout`. Há duas versões de layout; garantir consistência ao adicionar novas páginas.
- Alguns serviços (`UserService.updateUserOnBoard`, etc.) ainda lançam `Method not implemented`; confirme antes de utilizar.
- Fluxo financeiro (contas/relatórios) ainda não possui implementação; mapear requisitos antes de criar modelos.
- `AuthService.fetchSession` manipula `document.cookie` diretamente; ajuste caso rode em ambientes SSR.

## Boas práticas para novos agentes
- Use `apply_patch` para editar arquivos e mantenha ASCII.
- Rode `yarn tsc --noEmit` sempre que possível antes de finalizar; `yarn lint` pode exigir intervenção manual até que o `.eslintrc` esteja configurado.
- Prefira `rg` para localizar código. Respeite stores MobX: atualize estado dentro de `runInAction` se mexer nos stores.
- Para novos endpoints, atualize o par: serviço cliente + handler em `app/api` + ação Prisma em `actions/*.action.ts` e, se necessário, ajusta `schema.prisma`/migrations.
- Para formularios, siga padrão React Hook Form + Zod usado nos componentes existentes; mantenha callbacks `on*Added`/`on*Updated` para revalidar dados via SWR.
