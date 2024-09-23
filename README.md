# Image Upload and Processing Service

## Overview

This project is a backend web service that allows users to upload images, process them, and add comments. It's built using Node.js, Express, TypeScript, and PostgreSQL, with AWS Cloud Services utilized for hosting and storage.

## Features

- Image upload to AWS S3
- Image metadata storage in PostgreSQL database
- Image processing service
- Comment system for images
- Email notifications for new processed images
- RESTful API for client interactions

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- TypeORM
- AWS SDK (S3)
- Docker
- Terraform

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- AWS Account with S3 access
- Docker
- Terraform

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/image-upload-service.git
   cd image-upload-service
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   NODE_ENV=development
   PORT=3000

   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name

   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_s3_bucket_name

   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   EMAIL_FROM=your_email@example.com
   EMAIL_TO=recipient@example.com
   ```

4. Set up the database:
   ```
   yarn typeorm migration:run
   ```

5. Build the project:
   ```
   yarn build
   ```

6. Start the server:
   ```
   yarn start
   ```

## API Endpoints

- `POST /api/images`: Upload a new image
- `GET /api/images`: Get all images (with pagination)
- `GET /api/images/:id`: Get a specific image
- `POST /api/images/:id/comments`: Add a comment to an image

## Deployment

### Dockerization

1. Build the Docker image:
   ```
   docker build -t image-upload-app .
   ```

2. Run the container:
   ```
   docker run -p 3000:3000 image-upload-app
   ```

### AWS Deployment with Terraform

1. Initialize Terraform:
   ```
   terraform init
   ```

2. Plan the infrastructure:
   ```
   terraform plan
   ```

3. Apply the changes:
   ```
   terraform apply
   ```

## Testing

Run the test suite:

```
yarn test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.