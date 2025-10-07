#!/bin/bash

# Development script for Password Vault

echo "🚀 Starting Password Vault Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Docker is running"
echo "✅ Node.js is installed"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017/password-vault
NEXTAUTH_SECRET=dev-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🐳 Starting development environment with Docker..."
echo "This will start MongoDB and the Next.js development server"
echo ""

# Start development environment
docker-compose -f docker-compose.dev.yml up --build

echo ""
echo "🎉 Development environment is ready!"
echo "📱 Open your browser to: http://localhost:3000"
echo "🗄️  MongoDB is running on: mongodb://localhost:27017"
echo ""
echo "To stop the environment, press Ctrl+C"
