#!/bin/bash
set -e

echo "⚡ VidClaw Update"
echo ""

DASHBOARD_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DASHBOARD_DIR"

echo "📥 Pulling latest changes..."
git pull

echo "📦 Installing dependencies..."
npm install --production=false

echo "🔨 Building frontend..."
npm run build

echo "🔄 Restarting service..."
sudo systemctl restart vidclaw

echo ""
echo "✅ VidClaw updated and restarted!"
