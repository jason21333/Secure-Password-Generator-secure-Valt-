#!/bin/bash

# Production setup script for Password Vault

echo "🔧 Setting up Password Vault for Production"
echo "==========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Create production .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    echo "⚠️  IMPORTANT: Please update the values in .env.local for production!"
    cat > .env.local << EOF
MONGODB_URI=mongodb://admin:your-secure-password@mongodb:27017/password-vault?authSource=admin
NEXTAUTH_SECRET=your-super-secure-jwt-secret-key-change-this
NEXTAUTH_URL=https://your-domain.com
EOF
    echo "✅ .env.local created"
    echo "⚠️  Please update the values in .env.local before running!"
else
    echo "✅ .env.local already exists"
fi

# Build the application
echo "🔨 Building the application..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Application built successfully"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🚀 Starting production environment..."
echo "This will start MongoDB and the Next.js production server"
echo ""

# Start production environment
docker-compose up --build -d

echo ""
echo "🎉 Production environment is ready!"
echo "📱 Your application is running on: http://localhost:3000"
echo "🗄️  MongoDB is running with authentication"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
