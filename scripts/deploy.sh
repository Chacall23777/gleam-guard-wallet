#!/bin/bash
# =============================================
# Chacal Wallet Manager - Script de Deploy
# =============================================

set -e

echo "🚀 Iniciando Deploy do Chacal Wallet Manager..."

# Atualiza o código
git pull origin main

# Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Build Backend
echo "📦 Building Backend..."
cd backend
npm install
npm run build
cd ..

# Docker
echo "🐳 Subindo containers com Docker..."
docker compose down --remove-orphans
docker compose up -d --build

echo "✅ Deploy finalizado com sucesso!"
echo "🌐 Frontend rodando em: http://localhost:5173"
echo "🔌 Backend rodando em: http://localhost:3333"
