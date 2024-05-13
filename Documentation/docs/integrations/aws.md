# AWS Resources

The Adroit Frontend Manager application utilizes various AWS services to power its functionality and infrastructure. The following AWS resources are used:

## AWS S3

AWS S3 (Simple Storage Service) is used to store and retrieve data for the application. Specifically, it is used to store the offline device data that is displayed on the dashboard. An AWS Lambda function updates the data in the S3 bucket every 6 hours, ensuring that the dashboard always displays the most recent information.

## AWS Lambda

AWS Lambda is used to run serverless functions that perform specific tasks for the application. In this case, a Lambda function is responsible for updating the offline device data in the AWS S3 bucket every 6 hours. This ensures that the dashboard data is kept up to date without requiring manual intervention.

## API Gateway

API Gateway is used to create, publish, and manage APIs for the application. It acts as the entry point for the frontend application to access backend services and resources. API Gateway is likely used in conjunction with AWS Lambda to expose the necessary endpoints for retrieving data and performing actions.

## IoT Core

AWS IoT Core is a managed cloud service that allows connected devices to easily and securely interact with cloud applications and other devices. In the context of the Adroit Frontend Manager application, IoT Core is used to manage and communicate with the IoT devices. It enables device registration, device shadows (virtual representations), and secure communication between devices and the cloud.

## AWS Cognito

AWS Cognito is used for user authentication and management in the application.The application integrates with Cognito to handle user authentication flows, including redirecting unauthenticated users to the login page and managing user sessions. Cognito securely stores user information and provides JWT tokens for authenticated requests.

## AWS Amplify

In the Adroit Frontend Manager application, Amplify is used for continuous deployment and hosting of the frontend. It simplifies the process of deploying the application to a production environment and provides features like automatic builds, previews, and custom domains. The frontend code is deployed to Amplify, which serves the application to end-users.