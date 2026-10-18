#!/usr/bin/env bash
set -e

# ==============================================================================
# Google Cloud Run Deployment Script for Valyou Web Frontend
# ==============================================================================

PROJECT_ID="${GCP_PROJECT_ID:-project-0b49d67d-589a-4ce0-960}"
REGION="${GCP_REGION:-asia-southeast1}"
SERVICE_NAME="${GCP_SERVICE_NAME:-valyou-web}"
REPO_NAME="${GCP_REPO_NAME:-valyou-repo}"

echo "🚀 Starting deployment for Valyou Web to Google Cloud Run..."
echo "Project ID : $PROJECT_ID"
echo "Region     : $REGION"
echo "Service    : $SERVICE_NAME"
echo ""

# 1. Ensure Artifact Registry repository exists
echo "📦 [1/3] Checking Artifact Registry repository..."
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
    echo "Creating Artifact Registry repository '$REPO_NAME' in '$REGION'..."
    gcloud artifacts repositories create "$REPO_NAME" \
        --repository-format=docker \
        --location="$REGION" \
        --project="$PROJECT_ID" \
        --description="Docker repository for Valyou services"
else
    echo "Repository '$REPO_NAME' ready."
fi

# 2. Build and Push container image using Cloud Build
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
echo "🔨 [2/3] Building and pushing Docker container to Artifact Registry ($IMAGE_URI)..."
cd "$(dirname "$0")"
gcloud builds submit --tag "$IMAGE_URI" --project="$PROJECT_ID" .

# 3. Deploy to Google Cloud Run
echo "🚀 [3/3] Deploying to Google Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image="$IMAGE_URI" \
    --region="$REGION" \
    --project="$PROJECT_ID" \
    --platform=managed \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --port=8080

echo ""
echo "🎉 Deployment successful!"
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" --format="value(status.url)")
echo "🌐 Valyou Web URL: $SERVICE_URL"
