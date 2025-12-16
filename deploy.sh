#!/bin/bash
set -e
set -x

echo "🚀 Starting Deployment Script on Server..."

cd /opt/n8n-docker-caddy/

echo "📦 Step 1/3: Installing Dependencies (as root)..."
# Using --unsafe-perm is generally safe here as we are root
# We explicitly install dev dependencies to get tsc/gulp
docker compose exec -T -u root n8n sh -c "cd /home/node/.n8n/custom/n8n-nodes-sumsub && npm install --include=dev --unsafe-perm"

echo "📦 Step 2/3: Building (as root)..."
docker compose exec -T -u root n8n sh -c "cd /home/node/.n8n/custom/n8n-nodes-sumsub && npm run build"

echo "📦 Step 3/3: Fixing Permissions..."
# Give ownership back to node user so the app can read the files
docker compose exec -T -u root n8n chown -R node:node /home/node/.n8n/custom/n8n-nodes-sumsub

echo "🔄 Restarting n8n..."
docker compose restart n8n

echo "✅ Deployment Successfully Completed!"
