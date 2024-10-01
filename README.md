
# URL Shortener Application


## Overview

The URL Shortener application provides a seamless way for users to shorten long URLs, track visit statistics, and download data in CSV format. This application features a NestJS backend API and an Angular frontend, allowing users to create and manage shortened URLs efficiently.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Usage](#frontend-usage)
- [Docker Configuration](#docker-configuration)
- [Testing](#testing)
- [License](#license)
- [Contributing](#contributing)

## Features

- Shorten long URLs and generate unique short links.
- Redirect users from the short URL to the original URL.
- View visit statistics for each shortened URL.
- Download statistics as CSV files.
- Built-in PostgreSQL database for data storage.

## Technologies Used

- **Backend**:
    - NestJS
    - TypeORM
    - PostgreSQL
- **Frontend**:
    - Angular
    - ngx-papaparse for CSV downloads
- **Testing**:
    - Jest
    - Supertest

## Getting Started

### Prerequisites

Ensure you have the following software installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies for both backend and frontend:

   **Backend**:
   ```bash
   cd src
   npm install
   ```

   **Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

#### Backend Configuration

1. Update the `docker-compose.yml` file if needed to customize database settings.
2. The backend service is configured to run on `http://localhost:3250` by default.

#### Frontend Configuration

1. Update `src/app/app.config.ts` if there are any specific configurations needed.

## Running the Application

### Using Docker

1. Run the Docker containers:

   ```bash
   docker-compose up -d
   ```

   This command will start the PostgreSQL database for development and testing.

### Running the Backend

1. Navigate to the backend directory and start the NestJS server:

   ```bash
   cd src
   npm run start:dev
   ```

### Running the Frontend

1. Open a new terminal window, navigate to the frontend directory, and start the Angular application:

   ```bash
   cd frontend
   npm start
   ```

2. Access the application at `http://localhost:4200/stats`.

## API Endpoints

### POST `/shorten`

- **Description**: Shortens a given URL.
- **Request Body**:
  ```json
  {
    "url": "http://example.com"
  }
  ```
- **Response**:
  ```json
  {
    "shortUrl": "http://localhost:3250/abc123"
  }
  ```

### GET `/stats`

- **Description**: Retrieves statistics for all shortened URLs.
- **Response**:
  ```json
{
  "stats": [
    {
      "originalUrl": "http://example.com",
      "slug": "abc123",
      "visitCount": 10
    },
    "..."
  ]
}
```

### GET `/:slug`

- **Description**: Redirects to the original URL based on the slug.
- **Response**: Redirects to the original URL.

## Frontend Usage

1. Visit `http://localhost:4200/stats` to access the statistics dashboard.
2. Click on the "Download CSV" button to download the statistics data as a CSV file.

## Docker Configuration

The `docker-compose.yml` file contains configurations for both development and testing environments. It sets up two PostgreSQL containers: one for the application and one for testing.

### Example `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16.3
    restart: always
    container_name: url_shortener_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: url_shortener
    ports:
      - "5433:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 5s
    networks:
      - url_shortener

  db_test:
    container_name: url_shortener_test_db
    image: postgres:16.3
    restart: always
    volumes:
      - db_test_data:/var/lib/postgresql/data
      - ./src/seeds/seed.sql:/docker-entrypoint-initdb.d/seed.sql
    ports:
      - "5434:5432"
    environment:
      POSTGRES_USER: local
      POSTGRES_PASSWORD: local
      POSTGRES_DB: test_e2e_db

volumes:
  db_data:
  db_test_data:

networks:
  url_shortener:
    driver: bridge
```

## Testing

### Running Unit Tests

To run the unit tests for the backend, navigate to the backend directory and execute:

```bash
npm run test
```

### Running E2E Tests

To run the End-to-End tests for the controller:

```bash
npm run test:e2e
```


