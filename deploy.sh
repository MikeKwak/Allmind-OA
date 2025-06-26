#!/bin/bash

# This script builds and deploys the AI Copilot application to Google Cloud Run.
#
# Prerequisites:
# 1. Google Cloud SDK (gcloud) installed and authenticated (`gcloud auth login`).
# 2. Docker installed.
# 3. A Google Cloud project with billing and the Cloud Run, Cloud Build,
#    and Secret Manager APIs enabled.
# 4. A secret named 'gemini-api-key' in Secret Manager with a version
#    containing your Gemini API key.
#
# Usage:
# 1. Make the script executable: `chmod +x deploy.sh`
# 2. Run the script: `./deploy.sh`

set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
# PLEASE SET YOUR GOOGLE CLOUD PROJECT ID HERE
export PROJECT_ID="ai-chatbot-landing" # Docker Compose will use this environment variable

REGION="us-central1" # e.g., us-central1
BACKEND_SERVICE_NAME="ai-copilot-backend"
FRONTEND_SERVICE_NAME="ai-copilot-frontend"
SECRET_NAME="gemini-api-key" # The name of the secret in Secret Manager
SECRET_VERSION="latest"      # The version of the secret to use

# --- Validation ---
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: PROJECT_ID is not set."
    echo "Please edit the deploy.sh script and set your Google Cloud project ID."
    exit 1
fi

echo "🚀 Starting deployment for project: $PROJECT_ID"

# --- Authenticate Docker with Google Container Registry ---
echo "🔐 Configuring Docker authentication for GCR..."
gcloud auth configure-docker --quiet

# --- Build Production Images ---
echo "🔨 Building production images for linux/amd64..."
# The compose file now names the images correctly, so we just build.
docker-compose -f docker-compose.prod.yml build

# --- Push Images to GCR ---
BACKEND_IMAGE_TAG="gcr.io/$PROJECT_ID/$BACKEND_SERVICE_NAME:latest"
FRONTEND_IMAGE_TAG="gcr.io/$PROJECT_ID/$FRONTEND_SERVICE_NAME:latest"

echo "☁️ Pushing images to GCR..."
docker push "$BACKEND_IMAGE_TAG"
docker push "$FRONTEND_IMAGE_TAG"

# --- Deploy Backend ---
echo "🚀 Deploying backend service: $BACKEND_SERVICE_NAME..."
gcloud run deploy "$BACKEND_SERVICE_NAME" \
  --image="$BACKEND_IMAGE_TAG" \
  --region="$REGION" \
  --platform="managed" \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=${SECRET_NAME}:${SECRET_VERSION}" \
  --set-env-vars="GIN_MODE=release,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,BIGTABLE_INSTANCE=ai-copilot" \
  --quiet

# --- Get Backend URL ---
echo "🔗 Fetching backend URL..."
BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE_NAME" --region="$REGION" --format="value(status.url)")

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Error: Could not retrieve backend URL. Deployment may have failed."
    exit 1
fi

echo "✅ Backend deployed at: $BACKEND_URL"

# Test the debug endpoint to see environment variables
curl "$BACKEND_URL/debug/env" | jq .

# --- Deploy Frontend ---
# The WebSocket URL must use the secure 'wss://' protocol
WS_URL="wss://${BACKEND_URL#https://}/ws"

echo "🚀 Deploying frontend service: $FRONTEND_SERVICE_NAME..."
gcloud run deploy "$FRONTEND_SERVICE_NAME" \
  --image="$FRONTEND_IMAGE_TAG" \
  --region="$REGION" \
  --platform="managed" \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=${BACKEND_URL},NEXT_PUBLIC_WS_URL=${WS_URL}" \
  --quiet

echo "🎉 Deployment complete!"
FRONTEND_URL=$(gcloud run services describe "$FRONTEND_SERVICE_NAME" --region="$REGION" --format="value(status.url)")
echo "✅ Frontend is available at: $FRONTEND_URL"

# Update the backend service with Bigtable environment variables
gcloud run services update ai-copilot-backend \
  --region=us-central1 \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=ai-chatbot-landing,BIGTABLE_INSTANCE=ai-copilot" \
  --quiet

# Verify the update
curl "$(gcloud run services describe ai-copilot-backend --region=us-central1 --format="value(status.url)")/debug/env" | jq . 