terraform {
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
  project = "osblptest"
  region  = "us-central1"
  zone    = "us-central1-c"
}

resource "random_id" "default" {
  byte_length = 8
}




resource "google_project_service" "cloud_resource_manager" {
  service = "cloudresourcemanager.googleapis.com"
}

resource "time_sleep" "wait_60_seconds" {
  depends_on      = [google_project_service.cloud_resource_manager]
  create_duration = "60s"
}

resource "google_project_service" "container_registry" {
  service    = "containerregistry.googleapis.com"
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