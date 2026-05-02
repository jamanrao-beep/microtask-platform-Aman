#!/bin/bash
# setup.sh — Run this ONCE after unzipping the project

set -e

echo ""
echo "TaskPro Setup"
echo "============="

# 1. Copy env if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env"
fi

# 2. Install all npm packages (this installs next, react, prisma etc.)
echo ""
echo "Step 1/3: Installing npm packages..."
npm install

# 3. Push Prisma schema to SQLite DB
echo ""
echo "Step 2/3: Creating database..."
npx prisma db push

# 4. Seed with demo data
echo ""
echo "Step 3/3: Seeding demo data..."
npm run db:seed

echo ""
echo "============================================"
echo "Setup complete! Run the app with:"
echo ""
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Demo logins:"
echo "  Worker -> worker@taskpro.com / worker123"
echo "  Admin  -> admin@taskpro.com  / admin123"
echo "============================================"
