resource "google_cloud_run_v2_service" "backend_service" {
  name                 = "${var.project}-backend-service"
  location             = "us-central1"
  deletion_protection  = false
  ingress              = "INGRESS_TRAFFIC_ALL"
  invoker_iam_disabled = true


  scaling {
    max_instance_count = 1
    min_instance_count = 0
  }

  template {
    service_account = google_service_account.backend_runtime.email
    containers {
      image = var.backend_image
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "2"
          memory = "1024Mi"
        }
      }
    }
  }
}

resource "google_cloud_run_v2_service" "frontend_service" {
  name                 = "${var.project}-frontend-service"
  location             = "us-central1"
  deletion_protection  = false
  ingress              = "INGRESS_TRAFFIC_ALL"
  invoker_iam_disabled = true

  scaling {
    max_instance_count = 1
    min_instance_count = 0
  }

  template {
    containers {
      image = var.frontend_image
      resources {
        limits = {
          cpu    = "2"
          memory = "1024Mi"
        }
      }
    }
  }
}

output "backend_url" {
  value = google_cloud_run_v2_service.backend_service.uri
}

output "frontend_url" {
  value = google_cloud_run_v2_service.frontend_service.uri
}

output "backend_name" {
  value = google_cloud_run_v2_service.backend_service.name
}
output "frontend_name" {
  value = google_cloud_run_v2_service.frontend_service.name
}
