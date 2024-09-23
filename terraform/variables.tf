variable "aws_region" {
  description = "The AWS region to create things in"
  default     = "ap-south-1"
}

variable "app_name" {
  description = "Name of the application"
  default     = "midlas-image-upload-app"
}

variable "app_count" {
  description = "Number of Docker containers to run"
  default     = 1
}

variable "db_host" {
  description = "Database host"
  default     = "localhost"
}

variable "db_port" {
  description = "Database port"
  default     = "5432"
}

variable "db_username" {
  description = "Database username"
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  default     = "midlas_test"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for image storage"
  default     = "midlas-test"
}

variable "smtp_host" {
  description = "SMTP host for sending emails"
  default     = "smtp.gmail.com"
}

variable "smtp_port" {
  description = "SMTP port"
  default     = "587"
}

variable "smtp_secure" {
  description = "Whether SMTP connection is secure"
  default     = false
}


variable "smtp_pass" {
  description = "SMTP password"
  sensitive   = true
}



