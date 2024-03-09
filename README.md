# PROJECT MANAGEMENT SYSTEM

## Initial Setup

To start working with this project, you should set up the development environment by following these steps:

### Setting Up Environment Variables

1. Copy the `.env.example` file included in this repository:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your own test credentials and settings. This file will contain all the necessary configurations for the project, including database credentials, ports, and any other required environment variables.

   Be sure to review and, if necessary, change the database user passwords, users, and any other sensitive settings before proceeding.

### Launching the Project with Docker

Once the `.env` file is set up, you can bring up the project using Docker Compose. This step will build and raise all the necessary containers for the project:
```bash
docker compose up --build -d
```

This command will build the images if it's the first time the project is being brought up, or if there have been changes in the dependencies, and then it will start the containers in detached mode.

### Bringing Down the Project with Docker

To stop and remove all the containers created by the `up` command, you can use:

```bash
docker compose down
```

This command stops and removes the containers, networks, and the default volume configuration associated with your Docker composition.

## API Documentation

To view the documentation of the APIs and test the available endpoints, visit the following URL after bringing up the project:

[http://localhost:3000/swagger-documentation](http://localhost:3000/swagger-documentation)

The Swagger documentation will provide you with an interactive interface to test the endpoints, view the expected parameters, and review the possible response codes.

