#!/bin/bash
set -e

echo "🚀 Starting Giftlist application..."

echo "⏳ Waiting for database to be ready..."
npx wait-on tcp:mysql:3306 -t 60000

echo "📊 Database is ready, applying schema..."
npx prisma db push --force-reset

echo "🔄 Running migrations..."
npx prisma migrate deploy || echo "Migration deploy completed (may have been empty)"

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🌱 Running database seed..."
npx prisma db seed

echo "✅ Starting application..."
exec node build