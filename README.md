# OrderFlow Application

Este repositório contém a aplicação principal do sistema OrderFlow, um sistema de gerenciamento de pedidos para lanchonetes, desenvolvido com arquitetura limpa (Clean Architecture) e executado em Kubernetes.

## Visão Geral

A aplicação OrderFlow é um microsserviço desenvolvido em TypeScript/Node.js que gerencia todo o fluxo de pedidos, desde a criação até a finalização, incluindo integração com gateway de pagamento.

### Funcionalidades Principais

- ✅ Gerenciamento de clientes
- ✅ Catálogo de produtos por categoria
- ✅ Criação e acompanhamento de pedidos
- ✅ Integração com gateway de pagamento
- ✅ Atualização de status de pedidos
- ✅ Webhook para notificações de pagamento
- ✅ Autenticação via JWT (integrado com Lambda Auth)

## Arquitetura

A aplicação segue os princípios da **Clean Architecture**, separando as responsabilidades em camadas bem definidas:

```
┌─────────────────────────────────────────────────────────────┐
│                     Adapters Layer                           │
│  (Controllers, HTTP Routes, External Interfaces)             │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  (Use Cases, DTOs, Business Logic)                           │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                             │
│  (Entities, Value Objects, Repository Interfaces)            │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  (Database, External Services, Configuration)                │
└─────────────────────────────────────────────────────────────┘
```

### Camadas

#### 1. Domain Layer (`src/domain/`)
Contém a lógica de negócio pura, independente de frameworks e tecnologias.

- **Entities**: Entidades de negócio (Cliente, Pedido, Produto, etc.)
- **Value Objects**: Objetos de valor (CPF, Email, Status, etc.)
- **Repository Interfaces**: Contratos para acesso a dados

#### 2. Application Layer (`src/application/`)
Contém os casos de uso da aplicação e orquestra a lógica de negócio.

- **Use Cases**: Implementação dos casos de uso
- **DTOs**: Objetos de transferência de dados
- **Ports**: Interfaces para comunicação com camadas externas

#### 3. Adapters Layer (`src/adapters/`)
Adaptadores para comunicação com o mundo externo.

- **Controllers**: Controladores HTTP
- **Presenters**: Formatação de respostas

#### 4. Infrastructure Layer (`src/infrastructure/`)
Implementações concretas de infraestrutura.

- **Database**: Repositórios e configuração do banco
- **HTTP**: Rotas e middleware
- **External Services**: Integrações externas (Payment Gateway)
- **Config**: Configurações e injeção de dependências

## Estrutura do Projeto

```
orderflow-application/
├── src/
│   ├── adapters/
│   │   └── controllers/
│   │       └── pedido-controller.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── categoria-dto.ts
│   │   │   ├── cliente-dto.ts
│   │   │   ├── pagamento-dto.ts
│   │   │   ├── pedido-dto.ts
│   │   │   └── produto-dto.ts
│   │   ├── ports/
│   │   │   ├── atualizar-status-pedido-use-case.ts
│   │   │   ├── checkout-use-case.ts
│   │   │   ├── consultar-status-pagamento-use-case.ts
│   │   │   ├── listar-pedidos-use-case.ts
│   │   │   ├── payment-gateway.ts
│   │   │   └── webhook-pagamento-use-case.ts
│   │   └── use-cases/
│   │       ├── atualizar-status-pedido-service.ts
│   │       ├── checkout-service.ts
│   │       ├── consultar-status-pagamento-service.ts
│   │       ├── listar-pedidos-service.ts
│   │       └── webhook-pagamento-service.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── base-entity.ts
│   │   │   ├── categoria.ts
│   │   │   ├── cliente.ts
│   │   │   ├── item-pedido.ts
│   │   │   ├── pagamento.ts
│   │   │   ├── pedido.ts
│   │   │   └── produto.ts
│   │   ├── repositories/
│   │   │   ├── categoria-repository.ts
│   │   │   ├── cliente-repository.ts
│   │   │   ├── pagamento-repository.ts
│   │   │   ├── pedido-repository.ts
│   │   │   └── produto-repository.ts
│   │   └── value-objects/
│   │       ├── enums.ts
│   │       └── value-objects.ts
│   └── infrastructure/
│       ├── config/
│       │   └── dependency-injection.ts
│       ├── external-services/
│       │   └── mock-payment-gateway.ts
│       └── http/
│           └── routes/
│               └── pedido-routes.ts
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── hpa.yaml
│   ├── network-policy.yaml
│   ├── pod-disruption-budget.yaml
│   ├── rbac.yaml
│   ├── namespace.yaml
│   ├── deploy.sh
│   └── cleanup.sh
├── .github/
│   └── workflows/
│       └── deploy.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Pré-requisitos

- Node.js 20.x ou superior
- Docker
- kubectl configurado
- Acesso ao cluster EKS
- Banco de dados PostgreSQL (AWS RDS)

## Configuração Local

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env`:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=orderflowdb
DB_USER=orderflow_admin
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-jwt-secret-key

# Payment Gateway
PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
PAYMENT_GATEWAY_API_KEY=your-api-key

# AWS
AWS_REGION=us-east-1
```

### 3. Executar em Desenvolvimento

```bash
# Compilar TypeScript
npm run build

# Executar aplicação
npm start

# Ou em modo watch
npm run dev
```

### 4. Executar Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes e2e
npm run test:e2e
```

## Docker

### Build da Imagem

```bash
docker build -t orderflow-app:latest .
```

### Executar Container

```bash
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=orderflowdb \
  -e DB_USER=orderflow_admin \
  -e DB_PASSWORD=your-password \
  orderflow-app:latest
```

## Deploy no Kubernetes

### 1. Configurar Secrets

```bash
# Criar namespace
kubectl create namespace orderflow

# Criar secret com credenciais do banco
kubectl create secret generic db-credentials \
  --from-literal=host=your-rds-endpoint \
  --from-literal=port=5432 \
  --from-literal=database=orderflowdb \
  --from-literal=username=orderflow_admin \
  --from-literal=password=your-password \
  -n orderflow

# Criar secret com JWT
kubectl create secret generic jwt-secret \
  --from-literal=secret=your-jwt-secret-key \
  -n orderflow
```

### 2. Deploy Automático

```bash
cd k8s
./deploy.sh
```

### 3. Deploy Manual

```bash
# Aplicar manifestos
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/network-policy.yaml
kubectl apply -f k8s/pod-disruption-budget.yaml
```

### 4. Verificar Deploy

```bash
# Verificar pods
kubectl get pods -n orderflow

# Verificar serviço
kubectl get svc -n orderflow

# Verificar ingress
kubectl get ingress -n orderflow

# Ver logs
kubectl logs -f deployment/orderflow-app -n orderflow
```

## CI/CD com GitHub Actions

### Secrets Necessários

Configure os seguintes secrets no GitHub:

- `AWS_ACCESS_KEY_ID`: Chave de acesso AWS
- `AWS_SECRET_ACCESS_KEY`: Chave secreta AWS
- `ECR_REPOSITORY`: Nome do repositório ECR
- `EKS_CLUSTER_NAME`: Nome do cluster EKS

### Workflow

O pipeline de CI/CD é acionado automaticamente:

1. **Push para main/develop**: Build, test e deploy
2. **Pull Request**: Build, test e análise de código

### Jobs do Pipeline

1. **lint-and-test**: Executa linter e testes
2. **build-and-push**: Constrói imagem Docker e envia para ECR
3. **deploy**: Atualiza deployment no Kubernetes
4. **security-scan**: Executa scan de segurança
5. **smoke-test**: Testes de fumaça pós-deploy

## API Endpoints

### Autenticação

Todos os endpoints (exceto health check) requerem autenticação via JWT no header:

```
Authorization: Bearer <token>
```

### Health Check

```
GET /health
```

### Clientes

```
POST   /api/clientes
GET    /api/clientes/:id
GET    /api/clientes/cpf/:cpf
PUT    /api/clientes/:id
DELETE /api/clientes/:id
```

### Categorias

```
GET    /api/categorias
GET    /api/categorias/:id
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id
```

### Produtos

```
GET    /api/produtos
GET    /api/produtos/:id
GET    /api/produtos/categoria/:categoriaId
POST   /api/produtos
PUT    /api/produtos/:id
DELETE /api/produtos/:id
```

### Pedidos

```
POST   /api/pedidos/checkout
GET    /api/pedidos
GET    /api/pedidos/:id
PUT    /api/pedidos/:id/status
GET    /api/pedidos/:id/pagamento/status
POST   /api/pedidos/webhook/pagamento
```

## Exemplos de Uso

### Criar Pedido (Checkout)

```bash
curl -X POST https://api.orderflow.com/api/pedidos/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "clienteId": "uuid-do-cliente",
    "itens": [
      {
        "produtoId": "uuid-do-produto",
        "quantidade": 2,
        "observacoes": "Sem cebola"
      }
    ],
    "observacoes": "Retirada no balcão"
  }'
```

### Listar Pedidos

```bash
curl -X GET https://api.orderflow.com/api/pedidos \
  -H "Authorization: Bearer <token>"
```

### Atualizar Status do Pedido

```bash
curl -X PUT https://api.orderflow.com/api/pedidos/uuid-do-pedido/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "status": "EM_PREPARACAO"
  }'
```

## Monitoramento

### Logs

```bash
# Logs em tempo real
kubectl logs -f deployment/orderflow-app -n orderflow

# Logs de todos os pods
kubectl logs -l app=orderflow -n orderflow --tail=100
```

### Métricas

```bash
# Uso de recursos
kubectl top pods -n orderflow

# Status do HPA
kubectl get hpa -n orderflow

# Eventos
kubectl get events -n orderflow --sort-by='.lastTimestamp'
```

### Health Checks

A aplicação expõe endpoints de health check:

- **Liveness**: `/health/live` - Verifica se a aplicação está viva
- **Readiness**: `/health/ready` - Verifica se a aplicação está pronta para receber tráfego

## Troubleshooting

### Aplicação não inicia

```bash
# Verificar logs
kubectl logs deployment/orderflow-app -n orderflow

# Verificar eventos
kubectl describe pod -l app=orderflow -n orderflow

# Verificar configuração
kubectl get configmap orderflow-config -n orderflow -o yaml
kubectl get secret db-credentials -n orderflow -o yaml
```

### Erro de conexão com banco de dados

1. Verificar se o RDS está acessível
2. Verificar security groups
3. Verificar credenciais no secret
4. Verificar VPC peering entre EKS e RDS

### Erro de autenticação

1. Verificar se o token JWT é válido
2. Verificar se o JWT_SECRET está configurado corretamente
3. Verificar integração com Lambda Auth

## Boas Práticas Implementadas

### Código

- ✅ Clean Architecture
- ✅ SOLID Principles
- ✅ Design Patterns (Repository, Factory, Strategy)
- ✅ Dependency Injection
- ✅ TypeScript com tipagem estrita
- ✅ Testes unitários e de integração
- ✅ Linting com ESLint
- ✅ Formatação com Prettier

### Segurança

- ✅ Autenticação JWT
- ✅ Validação de entrada
- ✅ Secrets no Kubernetes Secrets
- ✅ Network Policies
- ✅ RBAC
- ✅ Scan de vulnerabilidades
- ✅ Princípio do menor privilégio

### DevOps

- ✅ CI/CD automatizado
- ✅ Docker multi-stage build
- ✅ Kubernetes manifests
- ✅ Health checks
- ✅ Horizontal Pod Autoscaler
- ✅ Pod Disruption Budget
- ✅ Rolling updates
- ✅ Logs centralizados

## Contribuindo

1. Crie uma branch a partir de `develop`
2. Faça suas alterações seguindo os padrões do projeto
3. Execute os testes e linter
4. Abra um Pull Request para `develop`
5. Aguarde a revisão e aprovação

### Padrões de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona novo endpoint de produtos
fix: corrige validação de CPF
docs: atualiza documentação da API
test: adiciona testes para checkout
refactor: refatora serviço de pedidos
```

## Licença

MIT

## Suporte

Para questões e suporte, abra uma issue no repositório.
