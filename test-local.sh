#!/bin/bash

echo "🚀 Testing AI Copilot with Docker"
echo "=================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your GEMINI_API_KEY"
    echo "Example:"
    echo "GEMINI_API_KEY=your_api_key_here"
    exit 1
fi

# Check if GEMINI_API_KEY is set
if ! grep -q "GEMINI_API_KEY=" .env || grep -q "GEMINI_API_KEY=your_actual_gemini_api_key_here" .env; then
    echo "❌ Please set a valid GEMINI_API_KEY in your .env file"
    exit 1
fi

echo "✅ Environment file looks good"

# Stop any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Test backend health
echo "🏥 Testing backend health..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    docker-compose logs backend
    exit 1
fi

# Test frontend
echo "🌐 Testing frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
    docker-compose logs frontend
    exit 1
fi

# Test debug endpoint
echo "🔍 Testing debug endpoint..."
curl -s http://localhost:8080/debug/env | jq . 2>/dev/null || echo "Debug endpoint response (jq not available):"
curl -s http://localhost:8080/debug/env

echo ""
echo "🎉 Application is running successfully!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8080"
echo "   Health:   http://localhost:8080/health"
echo "   Debug:    http://localhost:8080/debug/env"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop:      docker-compose down"
echo "   Restart:   docker-compose restart"
echo ""
echo "💬 Test the chatbot by opening http://localhost:3000 and clicking the chat icon!"
echo "   Note: Chat history won't be persisted in local mode (no Bigtable credentials)" 