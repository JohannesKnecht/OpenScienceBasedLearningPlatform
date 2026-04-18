# OpenScienceBasedLearningPlatform


<img alt="screenshot" src="img.png">

## Usage Info

Feel free to use it, but note that OpenAI credits are limited and the application may stop once the credit has expired.

## Repository Structure

- `frontend/AnkiAICardCreationFrontend`: Vue 3 frontend
- `backend/AnkiAICardCreationToolboxBackend`: FastAPI backend
- `infrastructure`: Terraform for Google Cloud resources
- `.github/workflows/deploy.yaml`: CI/CD pipeline

## Local Development

### Frontend

```sh
cd frontend/AnkiAICardCreationFrontend
npm ci
npm run dev
```

### Backend

```sh
cd backend/AnkiAICardCreationToolboxBackend
uv sync --frozen --all-extras
uv run fastapi dev src/ankiaicardcreationtoolboxbackend/main.py
```

## Tests

### Frontend

```sh
cd frontend/AnkiAICardCreationFrontend
npm run build
npm run test:unit
```

### Backend

```sh
cd backend/AnkiAICardCreationToolboxBackend
uv run ruff check .
uv run ruff format --check .
uv run ty check
uv run pytest
```

## Deployment

Deployment runs through GitHub Actions in `.github/workflows/deploy.yaml`.

The pipeline does the following:

1. Runs frontend and backend checks.
2. Applies Terraform in `infrastructure/`.
3. Creates Cloud Run services with a temporary public image for first-time deployment.
4. Builds and pushes the real frontend and backend container images.
5. Deploys the real images to Cloud Run.

Terraform manages the base Google Cloud resources. The CI pipeline then updates the Cloud Run services with the freshly built application images.

## Infrastructure

See `infrastructure/README.md` for the Google Cloud and Workload Identity Federation setup.
