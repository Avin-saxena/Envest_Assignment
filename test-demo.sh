#!/bin/bash

echo "🧪 Testing Envest Application"
echo "============================="

BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"

echo ""
echo "🔍 Testing Backend Health..."

# Test backend health
if curl -s "$BACKEND_URL/api/health" > /dev/null; then
    echo "✅ Backend is running at $BACKEND_URL"
    
    # Test general news endpoint
    echo "📰 Testing general news endpoint..."
    NEWS_RESPONSE=$(curl -s "$BACKEND_URL/api/news/general")
    if echo "$NEWS_RESPONSE" | grep -q "success"; then
        echo "✅ General news API working"
    else
        echo "❌ General news API not responding correctly"
    fi
    
    # Test filtered news endpoint
    echo "📊 Testing filtered news endpoint..."
    FILTERED_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/news/filtered" \
        -H "Content-Type: application/json" \
        -d '{"stocks": ["RELIANCE", "TCS"]}')
    if echo "$FILTERED_RESPONSE" | grep -q "success"; then
        echo "✅ Filtered news API working"
    else
        echo "❌ Filtered news API not responding correctly"
    fi
    
else
    echo "❌ Backend is not running at $BACKEND_URL"
    echo "   Start backend with: cd backend-nodejs && npm run dev"
fi

echo ""
echo "🌐 Testing Frontend..."

# Test frontend
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend is running at $FRONTEND_URL"
else
    echo "❌ Frontend is not running at $FRONTEND_URL"
    echo "   Start frontend with: cd frontend-nextjs && npm run dev"
fi

echo ""
echo "📋 Test Summary"
echo "==============="
echo "Backend Health: $(curl -s "$BACKEND_URL/api/health" > /dev/null && echo '✅ OK' || echo '❌ Not Running')"
echo "Frontend: $(curl -s "$FRONTEND_URL" > /dev/null && echo '✅ OK' || echo '❌ Not Running')"

echo ""
echo "🎯 Manual Testing Steps:"
echo "1. Visit $FRONTEND_URL"
echo "2. Check general news on homepage"
echo "3. Add stocks to portfolio"
echo "4. View filtered news and AI analysis"
echo "5. Test AI analysis on individual articles"

echo ""
echo "📚 For detailed testing, see README.md" 