provider "aws" {
  region = var.aws_region
}

resource "aws_ecr_repository" "app_ecr_repo" {
  name = "${var.app_name}-repo"
}

resource "aws_ecs_cluster" "app_cluster" {
  name = "${var.app_name}-cluster"
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "${var.app_name}-task"
  container_definitions    = jsonencode([
    {
      name      = var.app_name
      image     = "${aws_ecr_repository.app_ecr_repo.repository_url}:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "DB_HOST", value = var.db_host },
        { name = "DB_PORT", value = var.db_port },
        { name = "DB_USERNAME", value = var.db_username },
        { name = "DB_PASSWORD", value = var.db_password },
        { name = "DB_NAME", value = var.db_name },
        { name = "AWS_REGION", value = var.aws_region },
        { name = "AWS_S3_BUCKET_NAME", value = var.s3_bucket_name }
      ]
    }
  ])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 512
  cpu                      = 256
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_service" "app_service" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  launch_type     = "FARGATE"
  desired_count   = var.app_count

  network_configuration {
    subnets          = aws_subnet.private.*.id
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_tasks.id]
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = var.app_name
    container_port   = 3000
  }

  depends_on = [aws_alb_listener.front_end]
}

resource "aws_security_group" "ecs_tasks" {
  name        = "${var.app_name}-sg"
  description = "allow inbound access from the ALB only"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 3000
    to_port         = 3000
    security_groups = [aws_security_group.lb.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}