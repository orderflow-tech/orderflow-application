# Manifestos Kubernetes - OrderFlow

Este diretório contém todos os manifestos Kubernetes necessários para deployar a aplicação OrderFlow em um cluster EKS.

## Estrutura dos Arquivos

### Configuração Base
- `namespace.yaml` - Namespace dedicado para a aplicação
- `configmap.yaml` - Configurações não sensíveis da aplicação
- `secrets.yaml` - Informações sensíveis (senhas, chaves API)
- `rbac.yaml` - Controle de acesso baseado em roles

### Banco de Dados
- `postgres.yaml` - Deployment, Service e PVC do PostgreSQL

### Aplicação
- `deployment.yaml` - Deployment da aplicação backend
- `service.yaml` - Services (LoadBalancer e ClusterIP)
- `hpa.yaml` - Horizontal Pod Autoscaler para escalabilidade

### Rede e Segurança
- `ingress.yaml` - Ingress com ALB para exposição externa
- `network-policy.yaml` - Políticas de rede para segurança
- `pod-disruption-budget.yaml` - Garantia de alta disponibilidade

### Scripts
- `deploy.sh` - Script para deploy completo da aplicação
- `cleanup.sh` - Script para remoção completa dos recursos

## Como Usar

### Deploy da Aplicação
```bash
# Executar o script de deploy
./deploy.sh

# Ou aplicar manualmente na ordem:
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f rbac.yaml
kubectl apply -f postgres.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f hpa.yaml
kubectl apply -f network-policy.yaml
kubectl apply -f pod-disruption-budget.yaml
kubectl apply -f ingress.yaml
```

### Verificar Status
```bash
# Ver todos os recursos
kubectl get all -n orderflow

# Ver logs da aplicação
kubectl logs -f deployment/orderflow-backend -n orderflow

# Ver métricas do HPA
kubectl get hpa -n orderflow
```

### Acesso Local
```bash
# Port forward para acesso local
kubectl port-forward service/orderflow-backend-service 8080:80 -n orderflow

# Acessar aplicação: http://localhost:8080
# Acessar documentação: http://localhost:8080/api-docs
```

### Remoção
```bash
# Executar script de limpeza
./cleanup.sh

# Ou remover manualmente
kubectl delete namespace orderflow
```

## Configurações Importantes

### Escalabilidade (HPA)
- **Mínimo**: 3 replicas
- **Máximo**: 20 replicas
- **CPU Target**: 70%
- **Memory Target**: 80%

### Recursos por Pod
- **Requests**: 250m CPU, 256Mi RAM
- **Limits**: 500m CPU, 512Mi RAM

### Segurança
- NetworkPolicies restringem comunicação entre pods
- RBAC com permissões mínimas necessárias
- Secrets para informações sensíveis
- SecurityContext configurado nos pods

### Alta Disponibilidade
- PodDisruptionBudget garante mínimo de 2 pods sempre disponíveis
- Probes de liveness e readiness configuradas
- Persistent Volume para PostgreSQL

## Personalização

### Variáveis de Ambiente
Edite `configmap.yaml` e `secrets.yaml` conforme necessário.

### Domínio
Atualize `ingress.yaml` com seu domínio real e certificado SSL.

### Recursos
Ajuste requests/limits em `deployment.yaml` conforme necessário.

### Escalabilidade
Modifique `hpa.yaml` para ajustar limites de escalabilidade.

