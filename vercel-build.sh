#!/bin/bash

echo "🔧 Running Prisma generate..."
npx prisma generate

echo "🚧 Building Next.js project..."
npm run build