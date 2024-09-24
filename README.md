# Alissa Loan Application

This repository is a pseudo-monorepo containing all services, config required for the Driva loan application.

## API Specifications
Refer to `api-schema.md` file for API Specifications.

## Improvemtns
Refer to `IMPROVEMENTS.md` file for any improvemtns to this app.

## Log File
The application's runtime activities and errors are logged to `loan-app.log`. This log file helps in tracking application behavior and troubleshooting issues.


## Getting Started

### Requirements

- In root folder, run `npm install` to install all dependencies required for this app.


### Start Project

To start project run:

```bash
npm start
```

This will:

- start the API on port 3000 in watch mode.


### Running Tests

First, you need to start the services. To do that, from the project root, run:

```bash
npm start
```

Then you can run the tests like so:

```bash
npm test
```

## Project Structure

- `src/` - Express webserver responding to API requests
- `src/api-tests` - Tests for all APIs
- `src/entities` - Entity schema: loan application schema
- `src/http-schema` - HTTP schema: define request and response schema for all APIs
- `src/repos` - A loan repository to perfrom CRUD to the in-memory database
- `src/routes` - routes that handle API request
- `src/utils` - util functions like `calculateMonthlyPayment`
