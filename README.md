# 🌲 Sistema de Gestão de Agrupamentos de Madeira

> MVP de Front-end Avançado desenvolvido com **Vue.js 3** e **Quasar Framework**

Uma aplicação web moderna para gerenciamento de agrupamentos de madeira com funcionalidades de cadastro, controle de estoque e cálculo automático de frete baseado em geolocalização.

## 🎯 Objetivo da Aplicação

O sistema foi desenvolvido para resolver problemas reais de empresas madeireiras que precisam:

- **Controlar estoques** de agrupamentos de toras com informações precisas (ID, quantidade, peso)
- **Calcular fretes automaticamente** baseado na distância entre CEPs de origem e destino
- **Centralizar informações** de forma organizada e acessível
- **Otimizar operações logísticas** com dados geográficos precisos

## ✨ Funcionalidades Principais

### 📋 Gestão de Agrupamentos
- ✅ **Cadastro** de agrupamentos com validação de campos
- ✅ **Listagem** dinâmica e responsiva em tabela
- ✅ **Edição** via modal com dados pré-preenchidos
- ✅ **Exclusão** com feedback visual

### 🚚 Cálculo de Frete
- ✅ **Integração com APIs externas** para busca de coordenadas
- ✅ **Cálculo automático** de distância e valor estimado
- ✅ **Validação de CEP** em tempo real
- ✅ **Feedback detalhado** com distância e valor

### 🎨 Interface e Usabilidade
- ✅ **Design moderno** com Quasar Material Design
- ✅ **Layout responsivo** para desktop, tablet e mobile
- ✅ **Notificações visuais** para todas as operações
- ✅ **Loading states** durante requisições
- ✅ **Rota 404** para URLs inexistentes

## 🛠️ Tecnologias Utilizadas

### Frontend Framework
- **Vue.js 3** - Framework JavaScript reativo
- **Quasar Framework** - UI library baseada em Material Design
- **Vue Router** - Roteamento de páginas SPA
- **Pinia** - Gerenciamento de estado (configurado)

### Ferramentas e Build
- **Vite** - Build tool e dev server
- **ESLint** + **Prettier** - Linting e formatação
- **Axios** - Cliente HTTP para APIs
- **SCSS** - Pré-processador CSS

### DevOps e Deploy
- **Docker** - Containerização
- **Nginx** - Servidor web para produção
- **Node.js 18** - Ambiente de desenvolvimento

## 🌐 APIs Externas Utilizadas

### 1. ViaCEP API
- **URL:** https://viacep.com.br
- **Licença:** Gratuita e pública
- **Cadastro:** Não requerido
- **Função:** Busca de endereços por CEP brasileiro
- **Endpoint usado:** `GET https://viacep.com.br/ws/{cep}/json/`

### 2. Geoapify API
- **URL:** https://www.geoapify.com
- **Licença:** Freemium (3.000 requisições/dia gratuitas)
- **Cadastro:** Requerido para API Key
- **Função:** Geocodificação e cálculo de rotas
- **Endpoints usados:**
  - `GET /v1/geocode/search` - Busca coordenadas
  - `GET /v1/routing` - Cálculo de distância

## 🚀 Instalação e Execução

### Pré-requisitos
- **Node.js** 18+
- **npm** 6.13.4+ ou **yarn** 1.21.1+

### Método 1: Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/agrupamentos-frontend.git
cd agrupamentos-frontend

# 2. Instale as dependências
npm install

# 3. Execute em modo desenvolvimento
npm run dev

# 4. Acesse http://localhost:9000
```

### Método 2: Build de Produção

```bash
# 1. Gere o build otimizado
npm run build

# 2. Os arquivos estarão em /dist/spa
```

### Método 3: Docker

```bash
# 1. Build da imagem
docker build -t agrupamentos-frontend .

# 2. Execute o container
docker run -p 80:80 agrupamentos-frontend

# 3. Acesse http://localhost
```

## 📁 Estrutura do Projeto

```
src/
├── api/                    # Serviços de API
│   └── agrupamento.js     # Integração com APIs externas
├── components/            # Componentes reutilizáveis
│   └── EssentialLink.vue  # Componente de link
├── layouts/               # Layouts da aplicação
│   └── MainLayout.vue     # Layout principal com header/drawer
├── pages/                 # Páginas/Views
│   ├── IndexPage.vue      # Página principal (CRUD + Frete)
│   └── ErrorNotFound.vue  # Página 404
├── router/                # Configuração de rotas
│   ├── index.js          # Setup do Vue Router
│   └── routes.js         # Definição das rotas
├── stores/                # Gerenciamento de estado (Pinia)
├── css/                   # Estilos globais
└── boot/                  # Plugins e configurações
    └── axios.js          # Configuração do Axios
```

## 🧩 Componentização Implementada

### Componentes Reutilizáveis (4+ conforme requisito)

1. **MainLayout.vue** - Layout base com header responsivo e drawer de navegação
2. **q-table** (Quasar) - Tabela de dados reutilizada em múltiplos contextos
3. **q-dialog** (Quasar) - Modais para formulários de cadastro/edição e cálculo de frete
4. **q-btn** (Quasar) - Botões padronizados com diferentes variantes (primary, negative, deep-orange)
5. **q-input** (Quasar) - Campos de entrada com validação e máscaras (CEP)

### Página com Formulário Completo
**IndexPage.vue** implementa:
- ✅ **Validação de campos** obrigatórios (ID, quantidade, peso)
- ✅ **Salvamento em memória** usando useState do Vue
- ✅ **Lista dinâmica** exibindo dados em tabela responsiva

## 🔄 Hooks e Navegação Implementados

### Vue Composition API
- **ref/reactive** - Estado reativo dos dados
- **onMounted** - Carregamento inicial dos dados
- **computed** - Propriedades computadas

### Vue Router
- **useRouter** - Navegação programática
- **Rota 404** - Captura de URLs inexistentes com `/:catchAll(.*)*`

## 📱 Responsividade e UX

### Feedback Visual
- **Notificações Quasar** (success, error, info) para todas as operações
- **Loading states** em botões durante requisições assíncronas
- **Ícones intuitivos** (edit, delete, map) para ações na tabela

### Layout Responsivo
- **Grid system flexível** do Quasar Framework
- **Tabela adaptável** com scroll horizontal em mobile
- **Modais responsivos** que se ajustam ao tamanho da tela
- **Breakpoints otimizados** para desktop, tablet e smartphone

### Mensagens Contextuais
- **"Distância: X km | Frete estimado: R$ X"** após cálculo bem-sucedido
- **Tratamento de erros** da API com mensagens amigáveis
- **Estados vazios** com orientações para o usuário

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Verificação de código (ESLint)
npm run format       # Formatação de código (Prettier)
```

## 🐳 Deploy com Docker

O projeto inclui **Dockerfile multi-stage** otimizado:

1. **Stage 1 (builder):** Build da aplicação com Node.js
2. **Stage 2 (production):** Serve com Nginx Alpine (imagem mínima)

### Configuração Nginx
- Serve arquivos estáticos otimizados
- Fallback para SPA (Single Page Application)
- Configuração em `nginx.conf`

## 🎥 Demonstração

> **Link do vídeo de demonstração:** [Inserir link aqui]

**Roteiro do vídeo (6 min):**
1. Objetivo da aplicação (30s)
2. Componentização e formulários (3min)
3. Navegação e hooks (1min)
4. Integração com APIs (30s)
5. Usabilidade e responsividade (1min)

## 🤝 Backend Integration

**API Backend:** Sistema Flask para persistência de dados
- **Repositório:** [Link para API backend]
- **Endpoints:** CRUD completo para agrupamentos
- **Documentação:** Swagger disponível em `/apidocs`

## 📄 Licença

Este projeto está sob a licença **MIT**.

## 🏆 Requisitos MVP Atendidos

### ✅ Componentização (3,5 pts)
- **4+ componentes reutilizáveis** (MainLayout, q-table, q-dialog, q-btn, q-input)
- **Formulário completo** com validação, salvamento em memória e listagem
- **Originalidade** com funcionalidades de geolocalização e cálculo de frete

### ✅ React/Vue e Roteamento (2 pts)
- **Hooks/Composables** (ref, onMounted, useRouter)
- **Vue Router** com navegação entre páginas
- **Rota 404** implementada

### ✅ API Externa (1 pt)
- **Duas APIs públicas** integradas (ViaCEP + Geoapify)
- **Tratamento de erros** e dados exibidos na interface
- **Documentação completa** das APIs utilizadas

### ✅ Usabilidade (1,5 pt)
- **Feedback visual** completo (loading, notificações, ícones)
- **Layout responsivo** para todos os dispositivos
- **Mensagens contextuais** e estados de erro

### ✅ Organização (2 pts)
- **Projeto no GitHub** público
- **README bem estruturado** com todas as informações
- **Estrutura organizada** de pastas e arquivos
- **Boas práticas** de nomenclatura e código

## 👨‍💻 Autor

**ACNormun** 🐝
- GitHub: [@acnormun](https://github.com/acnormun)
- Email: anaclaranoronha.m@gmail.com

---

> **MVP de Desenvolvimento Front-end Avançado** - PUC-Rio
> **Professores:** Dieinison Braga e Marisa Silva
