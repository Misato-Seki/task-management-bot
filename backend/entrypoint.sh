#!/bin/sh

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting the application..."
node src/index.js &

echo "Set Discord Bot..."
node src/bot.js &

wait
