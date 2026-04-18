# Infrastructure
Infrastructure is handled using Terraform.

See
https://github.com/google-github-actions/auth#indirect-wif

PROJECT_ID="osblptest"
PROJECT_NUMBER="485236032574"
POOL_ID="github"
REPO="JohannesKnecht/OpenScienceBasedLearningPlatform" 
REPO_ID="1205863955" 
(curl -sfL -H "Accept: application/json" "https://api.github.com/repos/${REPO}" | jq .id)
WORKLOAD_IDENTITY_POOL_ID="projects/485236032574/locations/global/workloadIdentityPools/github"
(see below)


1 ) Enable APIs
gcloud services enable \
  iam.googleapis.com \
  cloudresourcemanager.googleapis.com \
  sts.googleapis.com \
  iamcredentials.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  --project="$PROJECT_ID"

2) Create SA
gcloud iam service-accounts create githubactionsa \
  --project="$PROJECT_ID" \
  --display-name="GitHub action SA"

3) Give SA roles

```sh
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:githubactionsa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/writer"
```


4) create pool


gcloud iam workload-identity-pools create "$POOL_ID" \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool"


5.  Get the full ID of the Workload Identity **Pool** (optional as static)

    ```sh
    gcloud iam workload-identity-pools describe "github" \
      --project="${PROJECT_ID}" \
      --location="global" \
      --format="value(name)"
    ```


7.  Create a Workload Identity **Provider** in that pool:

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



8.  Allow authentications from the Workload Identity Pool to your Google Cloud
    Service Account.

    gcloud iam service-accounts add-iam-policy-binding "githubactionsa@${PROJECT_ID}.iam.gserviceaccount.com" \
      --project="${PROJECT_ID}" \
      --role="roles/iam.workloadIdentityUser" \
      --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO}"
    ```


9.  Extract the Workload Identity **Provider** resource name:

    ```sh


    gcloud iam workload-identity-pools providers describe "osblp-repo" \
      --project="${PROJECT_ID}" \
      --location="global" \
      --workload-identity-pool="github" \
      --format="value(name)"
    ```

    Use this value as the `workload_identity_provider` value in the GitHub
    Actions YAML:

    ```yaml
    - uses: 'google-github-actions/auth@v3'
      with:
        service_account: 'githubactionsa@osblptest.iam.gserviceaccount.com'
        workload_identity_provider: 'projects/485236032574/locations/global/workloadIdentityPools/github/providers/osblp-repo'
    ```

