# Infrastructure

Infrastructure is handled using Terraform.

See https://github.com/google-github-actions/auth#indirect-wif

## CI/CD Environments

The pipeline deploys to two GitHub environments:

| GitHub environment | Trigger | GCP project (example) |
|--------------------|---------|----------------------|
| `test`             | Every pull request | `osblptest` |
| `production`       | Push / merge to `main` | `osblpprod` |

### Required GitHub environment variables

Configure the following **variables** (non-secret) in each environment
under *Settings → Environments* in the GitHub repository:

| Variable | Example (`test`) | Example (`production`) |
|---|---|---|
| `PROJECT` | `osblptest` | `osblpprod` |
| `LOCATION` | `us-central1` | `us-central1` |
| `REGISTRY` | `us-central1-docker.pkg.dev` | `us-central1-docker.pkg.dev` |
| `REPOSITORY` | `osblptest/osblptest-repository` | `osblpprod/osblpprod-repository` |
| `TERRAFORM_BACKEND_BUCKET` | `osblptest-terraform-backend` | `osblpprod-terraform-backend` |
| `GCP_SERVICE_ACCOUNT` | `githubactionsa@osblptest.iam.gserviceaccount.com` | `githubactionsa@osblpprod.iam.gserviceaccount.com` |
| `WIF_PROVIDER` | `projects/485236032574/locations/global/workloadIdentityPools/github/providers/osblp-repo` | `projects/<prod-project-number>/locations/global/workloadIdentityPools/github/providers/osblp-repo` |

### Required GitHub environment secret

| Secret | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key used by the backend |

### Enabling the production approval gate

1. Go to *Settings → Environments → production* in the GitHub repository.
2. Enable **Required reviewers** and add the reviewers who must approve before production deployment starts.

---

## GCP project setup

Run the steps below once for each GCP project (replace `$PROJECT_ID`, `$PROJECT_NUMBER`, and `$REPO_ID` as appropriate).

```sh
PROJECT_ID="osblptest"         # or "osblpprod" for production
PROJECT_NUMBER="485236032574"  # numeric ID of the project
POOL_ID="github"
REPO="JohannesKnecht/OpenScienceBasedLearningPlatform"
REPO_ID="1205863955"
# REPO_ID=$(curl -sfL -H "Accept: application/json" "https://api.github.com/repos/${REPO}" | jq .id)
WORKLOAD_IDENTITY_POOL_ID="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github"
```


1. Enable APIs

```sh
gcloud services enable \
  iam.googleapis.com \
  cloudresourcemanager.googleapis.com \
  sts.googleapis.com \
  iamcredentials.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  --project="$PROJECT_ID"
```

2. Create SA

```sh
gcloud iam service-accounts create githubactionsa \
  --project="$PROJECT_ID" \
  --display-name="GitHub action SA"
```

3. Give SA roles

```sh
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:githubactionsa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/writer"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:githubactionsa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:githubactionsa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountAdmin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:githubactionsa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.admin"
```

4. Create Workload Identity Pool

```sh
gcloud iam workload-identity-pools create "$POOL_ID" \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool"
```

5. Get the full ID of the Workload Identity **Pool** (optional — the value is static)

```sh
gcloud iam workload-identity-pools describe "github" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --format="value(name)"
```

6. Create a Workload Identity **Provider** in that pool

```sh
gcloud iam workload-identity-pools providers create-oidc "osblp-repo" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="My GitHub repo Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_id=assertion.repository_id" \
  --attribute-condition="assertion.repository_id == '${REPO_ID}'" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

7. Allow authentications from the Workload Identity Pool to the Service Account

```sh
gcloud iam service-accounts add-iam-policy-binding "githubactionsa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO}"
```

8. Extract the Workload Identity **Provider** resource name

```sh
gcloud iam workload-identity-pools providers describe "osblp-repo" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github" \
  --format="value(name)"
```

Set the output as the `WIF_PROVIDER` GitHub environment variable for the corresponding environment.
