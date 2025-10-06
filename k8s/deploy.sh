#!/bin/bash

# Script para aplicar todos os manifestos Kubernetes na ordem correta

set -e

echo "🚀 Iniciando deploy da aplicação OrderFlow no Kubernetes..."

# Verificar se kubectl está configurado
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Erro: kubectl não está configurado ou cluster não está acessível"
    exit 1
fi

# Aplicar manifestos na ordem correta
echo "📦 Criando namespace..."
kubectl apply -f namespace.yaml

echo "🔧 Aplicando ConfigMaps e Secrets..."
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml

echo "🔐 Configurando RBAC..."
kubectl apply -f rbac.yaml

echo "🗄️ Deployando PostgreSQL..."
kubectl apply -f postgres.yaml

echo "⏳ Aguardando PostgreSQL ficar pronto..."
kubectl wait --for=condition=ready pod -l app=postgres -n orderflow --timeout=300s

echo "🚀 Deployando aplicação backend..."
kubectl apply -f deployment.yaml

echo "🌐 Criando Services..."
kubectl apply -f service.yaml

echo "📈 Configurando HPA..."
kubectl apply -f hpa.yaml

echo "🛡️ Aplicando NetworkPolicies..."
kubectl apply -f network-policy.yaml

echo "🔄 Configurando PodDisruptionBudgets..."
kubectl apply -f pod-disruption-budget.yaml

echo "🌍 Configurando Ingress..."
kubectl apply -f ingress.yaml

echo "⏳ Aguardando aplicação ficar pronta..."
kubectl wait --for=condition=ready pod -l app=orderflow-backend -n orderflow --timeout=300s

echo "✅ Deploy concluído com sucesso!"
echo ""
echo "📊 Status dos recursos:"
kubectl get all -n orderflow

echo ""
echo "🔍 Para verificar os logs da aplicação:"
echo "kubectl logs -f deployment/orderflow-backend -n orderflow"

echo ""
echo "🌐 Para acessar a aplicação:"
echo "kubectl port-forward service/orderflow-backend-service 8080:80 -n orderflow"
echo "Acesse: http://localhost:8080"

echo ""
echo "📚 Para acessar a documentação da API:"
echo "Acesse: http://localhost:8080/api-docs"

