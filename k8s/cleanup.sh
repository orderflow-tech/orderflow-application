#!/bin/bash

# Script para remover todos os recursos da aplicação OrderFlow do Kubernetes

set -e

echo "🗑️ Removendo aplicação OrderFlow do Kubernetes..."

# Remover recursos na ordem inversa
echo "🌍 Removendo Ingress..."
kubectl delete -f ingress.yaml --ignore-not-found=true

echo "🔄 Removendo PodDisruptionBudgets..."
kubectl delete -f pod-disruption-budget.yaml --ignore-not-found=true

echo "🛡️ Removendo NetworkPolicies..."
kubectl delete -f network-policy.yaml --ignore-not-found=true

echo "📈 Removendo HPA..."
kubectl delete -f hpa.yaml --ignore-not-found=true

echo "🌐 Removendo Services..."
kubectl delete -f service.yaml --ignore-not-found=true

echo "🚀 Removendo Deployment da aplicação..."
kubectl delete -f deployment.yaml --ignore-not-found=true

echo "🗄️ Removendo PostgreSQL..."
kubectl delete -f postgres.yaml --ignore-not-found=true

echo "🔐 Removendo RBAC..."
kubectl delete -f rbac.yaml --ignore-not-found=true

echo "🔧 Removendo ConfigMaps e Secrets..."
kubectl delete -f secrets.yaml --ignore-not-found=true
kubectl delete -f configmap.yaml --ignore-not-found=true

echo "📦 Removendo namespace..."
kubectl delete -f namespace.yaml --ignore-not-found=true

echo "✅ Remoção concluída com sucesso!"

