
# WATOFIER


This project connects to a user's social media accounts (currently supporting Twitter) and sends notifications to the specified social accounts when a stream on Twitch begins. It streamlines the notification process for streamers, ensuring their audience is promptly informed about live sessions across different platforms.


## Configuration

1. **Copy Environment Variables**:
   - Start by making a copy of the `.env.example` file and rename it to `.env`.
   - Open the `.env` file and fill in the necessary credentials and configurations. This step is crucial for setting up your database and other services.

## Prerequisites

Before you can run this project, make sure you have the following installed:
- **Node.js**: Version 21
- **NestJS**: Version 10.0.0
- **Docker and Docker Compose**: For containerization and easy deployment.

You can download Node.js from here: https://nodejs.org/.

## Installation

Follow these steps to install all dependencies for the project:

1. Navigate to the project directory and run:
   ```bash
   npm install
   ```

## Running the Application

To run the application with Docker Compose, execute the following command:

```bash
docker compose up --build -d
```

This command will build the Docker images and run the containers in the background.

## Accessing the API Documentation

Once the application is running, you can access the Swagger documentation for the API at:

[http://your-domain:3000/swagger-documentation](http://your-domain:3000/swagger-documentation)

Replace `your-domain` with the actual domain of your application or use `localhost` if you are running it locally.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
