#!/bin/bash

echo "🚀 Setting up Envest - AI-Powered Indian Financial News Curator"
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend-nodejs

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found. Make sure you're in the right directory."
    exit 1
fi

echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
EOF
    echo "⚠️  Please edit .env file and add your Gemini API key!"
    echo "   Get your API key from: https://ai.google.dev/"
else
    echo "✅ .env file already exists"
fi

cd ..

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend-nextjs

if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found. Make sure you're in the right directory."
    exit 1
fi

echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Add your Gemini API key to backend-nodejs/.env"
echo "2. Start the backend: cd backend-nodejs && npm run dev"
echo "3. Start the frontend: cd frontend-nextjs && npm run dev"
echo ""
echo "🌐 URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:3001"
echo "- Health Check: http://localhost:3001/api/health"
echo ""
echo "📚 Documentation: See README.md for detailed instructions"
echo ""
echo "Happy coding! 🚀" 