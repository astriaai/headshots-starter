#!/bin/bash

# Upscale Image Storage - Setup Verification Script
# Run this to verify everything is set up correctly

echo "================================"
echo "Upscale Storage Setup Verification"
echo "================================"
echo ""

# Check if env file exists
echo "✓ Checking .env.local..."
if [ -f ".env.local" ]; then
    echo "  ✓ .env.local found"
    
    # Check for required vars
    if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        echo "  ✓ SUPABASE_SERVICE_ROLE_KEY is configured"
    else
        echo "  ⚠️  SUPABASE_SERVICE_ROLE_KEY not found"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "  ✓ NEXT_PUBLIC_SUPABASE_URL is configured"
    fi
    
    if grep -q "UPSCALE_API_KEY" .env.local; then
        echo "  ✓ UPSCALE_API_KEY is configured"
    fi
else
    echo "  ❌ .env.local not found"
fi

echo ""
echo "✓ Checking code files..."

# Check if API route has Supabase integration
if grep -q "createClient" app/api/upscale/route.ts; then
    echo "  ✓ API route has Supabase integration"
else
    echo "  ❌ API route missing Supabase integration"
fi

# Check if component passes userId
if grep -q "userId:" components/ImageUpscaleZone.tsx; then
    echo "  ✓ Component passes userId to API"
else
    echo "  ❌ Component not passing userId"
fi

echo ""
echo "✓ Setup Files:"
if [ -f "setup-upscale-table.js" ]; then
    echo "  ✓ setup-upscale-table.js exists"
fi

if [ -f "UPSCALE_STORAGE_SETUP.md" ]; then
    echo "  ✓ UPSCALE_STORAGE_SETUP.md exists"
fi

if [ -f "UPSCALE_STORAGE_QUICK_START.md" ]; then
    echo "  ✓ UPSCALE_STORAGE_QUICK_START.md exists"
fi

echo ""
echo "================================"
echo "Next Steps:"
echo "================================"
echo ""
echo "1. Create the database table:"
echo "   Run SQL in Supabase dashboard (see UPSCALE_STORAGE_QUICK_START.md)"
echo ""
echo "2. Make sure SUPABASE_SERVICE_ROLE_KEY is in .env.local"
echo ""
echo "3. Restart your server:"
echo "   npm run dev"
echo ""
echo "4. Test it:"
echo "   Go to http://localhost:3000/upscale and upscale an image"
echo ""
echo "================================"
