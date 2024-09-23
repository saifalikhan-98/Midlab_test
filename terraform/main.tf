# Existing provider block
provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "${var.app_name}-vpc"
  }
}

# Subnets
resource "aws_subnet" "private" {
  count             = 2
  cidr_block        = "10.0.${count.index + 1}.0/24"
  vpc_id            = aws_vpc.main.id
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.app_name}-private-subnet-${count.index + 1}"
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app_name}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Existing ECR repository resource
resource "aws_ecr_repository" "app_ecr_repo" {
  name = "${var.app_name}-repo"
}

# Existing ECS cluster resource
resource "aws_ecs_cluster" "app_cluster" {
  name = "${var.app_name}-cluster"
}

# Updated ECS task definition resource
resource "aws_ecs_task_definition" "app_task" {
  family                   = "${var.app_name}-task"
  container_definitions    = jsonencode([
    {
      name      = var.app_name
      image     = "${aws_ecr_repository.app_ecr_repo.repository_url}:latest"
      cpu       = 256  # Reduced from 512
      memory    = 512  # Reduced from 1024
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = "3000" },
        { name = "DB_HOST", value = var.db_host },
        { name = "DB_PORT", value = var.db_port },
        { name = "DB_USERNAME", value = var.db_username },
        { name = "DB_PASSWORD", value = var.db_password },
        { name = "DB_NAME", value = var.db_name },
        { name = "AWS_REGION", value = var.aws_region },
        { name = "AWS_S3_BUCKET_NAME", value = var.s3_bucket_name },
      ]
    }
  ])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 1024  # This remains the same
  cpu                      = 512   # This remains the same
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}

# Updated ECS service resource
resource "aws_ecs_service" "app_service" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  launch_type     = "FARGATE"
  desired_count   = var.app_count

  network_configuration {
    subnets          = aws_subnet.private[*].id
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_tasks.id]
  }
}

# Updated ECS tasks security group
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.app_name}-sg"
  description = "Allow inbound access to ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 3000
    to_port     = 3000
    cidr_blocks = ["0.0.0.0/0"]  # Be cautious with this. Ideally, restrict to specific IPs or security groups.
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Data source for availability zones
data "aws_availability_zones" "available" {}