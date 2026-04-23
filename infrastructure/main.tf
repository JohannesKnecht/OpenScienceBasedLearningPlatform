terraform {
  backend "gcs" {}

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.2.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "0.13.1"
    }

  }
}


provider "google" {
  project = var.project
  region  = "us-central1"
  zone    = "us-central1-c"
}

locals {
  github_actions_service_account = "githubactionsa@${var.project}.iam.gserviceaccount.com"
}

variable "project" {
  type = string
}

variable "backend_image" {
  type    = string
  default = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "frontend_image" {
  type    = string
  default = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "configure_openai_secret" {
  type    = bool
  default = false
}




resource "google_project_service" "cloud_resource_manager" {
  service = "cloudresourcemanager.googleapis.com"
}

resource "time_sleep" "wait_60_seconds" {
  depends_on      = [google_project_service.cloud_resource_manager]
  create_duration = "60s"
}

resource "google_project_service" "artifact_registry" {
  service    = "artifactregistry.googleapis.com"
  depends_on = [time_sleep.wait_60_seconds]
}

resource "google_project_service" "run" {
  service    = "run.googleapis.com"
  depends_on = [time_sleep.wait_60_seconds]
}

resource "google_project_service" "secretmanager" {
  service    = "secretmanager.googleapis.com"
  depends_on = [time_sleep.wait_60_seconds]
}

resource "google_service_account" "backend_runtime" {
  account_id   = "backend-runtime"
  display_name = "Backend Cloud Run runtime"
}

resource "google_service_account_iam_member" "github_actions_backend_runtime_user" {
  service_account_id = google_service_account.backend_runtime.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${local.github_actions_service_account}"
}

resource "google_secret_manager_secret" "openai" {
  secret_id = "openai"

  replication {
    auto {}
  }

  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_iam_member" "backend_runtime_openai_accessor" {
  project   = var.project
  secret_id = google_secret_manager_secret.openai.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.backend_runtime.email}"
}
