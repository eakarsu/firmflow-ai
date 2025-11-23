#!/bin/bash

# FirmFlow AI - Startup Script
# This script checks PostgreSQL connection and starts the development server

set -e

echo "🚀 FirmFlow AI - Starting..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please copy .env.example to .env and configure it:"
    echo "  cp .env.example .env"
    exit 1
fi

# Load environment variables
source .env

# Extract database connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL not set in .env${NC}"
    exit 1
fi

# Parse DATABASE_URL to extract host and port
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

if [ -z "$DB_PORT" ]; then
    DB_PORT=5432
fi

echo "📊 Checking PostgreSQL connection..."
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo ""

# Check if PostgreSQL is running and accepting connections
echo "🔍 Testing database connection..."

# Try to connect to PostgreSQL
if command -v pg_isready &> /dev/null; then
    # Use pg_isready if available
    if pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is running and accepting connections${NC}"
    else
        echo -e "${RED}❌ Error: Cannot connect to PostgreSQL on $DB_HOST:$DB_PORT${NC}"
        echo ""
        echo "Please make sure PostgreSQL is running:"
        echo "  • Check if PostgreSQL service is started"
        echo "  • Verify the DATABASE_URL in .env is correct"
        echo "  • On macOS: brew services start postgresql"
        echo "  • On Linux: sudo systemctl start postgresql"
        exit 1
    fi
else
    # Fallback: try using psql
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c '\q' 2>/dev/null; then
            echo -e "${GREEN}✅ PostgreSQL is running and accepting connections${NC}"
        else
            echo -e "${RED}❌ Error: Cannot connect to PostgreSQL${NC}"
            echo ""
            echo "Please make sure PostgreSQL is running and DATABASE_URL is correct."
            exit 1
        fi
    else
        # If neither pg_isready nor psql is available, try a basic port check
        if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
            echo -e "${YELLOW}⚠️  PostgreSQL appears to be running (port check passed)${NC}"
            echo -e "${YELLOW}   Note: Install postgresql client tools for better checking${NC}"
        else
            echo -e "${RED}❌ Error: Cannot connect to PostgreSQL on $DB_HOST:$DB_PORT${NC}"
            echo ""
            echo "Please make sure PostgreSQL is running."
            exit 1
        fi
    fi
fi

echo ""

# Check if Prisma migrations are up to date
echo "🔧 Checking database schema..."

# Generate Prisma Client if needed
if [ ! -d "node_modules/.prisma" ]; then
    echo "   Generating Prisma Client..."
    npx prisma generate
fi

# Check if migrations need to be run
if npx prisma migrate status 2>&1 | grep -q "Database schema is up to date"; then
    echo -e "${GREEN}✅ Database schema is up to date${NC}"
elif npx prisma migrate status 2>&1 | grep -q "following migrations have not yet been applied"; then
    echo -e "${YELLOW}⚠️  Database migrations are pending${NC}"
    echo ""
    read -p "Do you want to run migrations now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx prisma migrate deploy
        echo -e "${GREEN}✅ Migrations applied successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping migrations - app may not work correctly${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Could not determine migration status${NC}"
    echo "   You may need to run: npx prisma migrate dev"
fi

echo ""

# Check if database has data
echo "📦 Checking for seed data..."
DB_CHECK=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"User\";" 2>/dev/null || echo "0")
DB_CHECK=$(echo $DB_CHECK | xargs) # trim whitespace

if [ "$DB_CHECK" = "0" ] || [ -z "$DB_CHECK" ]; then
    echo -e "${YELLOW}⚠️  Database appears to be empty${NC}"
    echo ""
    read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx prisma db seed
        echo -e "${GREEN}✅ Database seeded successfully${NC}"
        echo ""
        echo "📝 Default login credentials:"
        echo "   Admin:  admin@firmflow.ai / password123"
        echo "   Lawyer: sarah.johnson@firmflow.ai / password123"
    fi
else
    echo -e "${GREEN}✅ Database contains $DB_CHECK users${NC}"
fi

echo ""

# Check OpenRouter API key
if [ -z "$OPENROUTER_API_KEY" ] || [ "$OPENROUTER_API_KEY" = "your-openrouter-api-key-here" ]; then
    echo -e "${YELLOW}⚠️  Warning: OPENROUTER_API_KEY not configured${NC}"
    echo "   AI features will not work until you set a valid API key in .env"
    echo "   Get your key at: https://openrouter.ai/"
else
    echo -e "${GREEN}✅ OpenRouter API key is configured${NC}"
fi

echo ""

# Check NextAuth secret
if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" = "your-super-secret-key-change-this-in-production" ]; then
    echo -e "${YELLOW}⚠️  Warning: NEXTAUTH_SECRET is using default value${NC}"
    echo "   Generate a secure secret with: openssl rand -base64 32"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎉 All checks passed! Starting development server...${NC}"
echo ""
echo "📍 Application will be available at: http://localhost:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the development server
yarn dev
