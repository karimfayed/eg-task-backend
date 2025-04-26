# eg-task-backend

This is a backend application built with **NestJS**.

## Setup and Installation

### 1. Clone the repository

Clone the repository to your local machine:

```
git clone <repository-url>
```
### 2. Install Dependencies
Navigate into the project folder and install the required dependencies:
```
cd eg-task-backend
npm install
```
### 3. Create a .env file
Create a .env file in the root directory using the variable names in .env.sample. You can use the suggested values in the sample file:

```
cp .env.sample .env
```

### 4. Run the Backend
To start the backend application, run:
```
npm run start
```
The API will be available at http://localhost:3000.

### Postman Collection
Import the EG-Endpoints.postman_collection.json from the postman-collection folder into Postman to hit the API endpoints with example values.

### Steps:
 1. Open Postman.

 2. Click Import and select the EG-Endpoints.postman_collection.json file.

 3. The collection will be loaded and you can interact with the endpoints.

### OpenAPI Specification
To view the API documentation, open the open-api-spec.yaml file located in the root directory. You can view it using the VSCode OpenAPI extension or copy and paste it into Online Swagger Editor.

### Additional Information
For more information on how to extend or modify the application, refer to the NestJS documentation:
https://docs.nestjs.com/