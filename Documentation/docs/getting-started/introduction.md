# Introduction 🎉

Presenting Adroit Manager Frontend dashboard application developed with `React`, `NextJS 14`, `TypeScript`, `shadcn/ui`, and `TailwindCSS`. This dashboard was developed as part of a `AUT Research and Development` project which spanned from `2023-2024`.

The primary aim of the project was to solve Adroit's business problem in which they had to rely on emails to see which devices were offline.

## Key Features

The IoT Manager Frontend project aims to provide a comprehensive tool for the delivery team at Adroit Environmental IoT to monitor their sensors and devices effectively. The key features of the project include:

- Sensor Status Monitoring
- Battery Health Monitoring
- Ticketing System
- User Authentication
- Fault Identification
- Additional Features **(Not Implemented)**
  - Ticket Tracking System
  - Heat Maps so that users can see a comprehensive view of all the devices
  - Database to see how battery health degrades

## Pages

### Homepage / Dashboard

This page is at the root currently `localhost:3000`. On this page, users can view a comprehensive view of all IoT devices which are offline. This data is fetched from an **AWS S3 bucket** which is updated by an AWS Lambda script every 6 hours. The dashboard contains filtering and allows users to see the most recent offline devices, client name, client ID, device key, battery percentage as well as battery voltage. On the left side of the screen, the user can click the three dots menu. This menu allows the user to **view in-depth statistics**, **create a ticket**, or **view the client's devices**. [More Info](/pages/home-page.html)

### Client Page

The client page is located at `iot-frontend/src/pages/client-page/[clientPage].tsx`. It displays detailed information about a specific client. The page fetches the client ID from the URL using the `fetchIdAndType` function. The page requires authentication and uses the `useAuth` hook to check the authentication status. If the user is authenticated, the page displays the client name, client ID, total devices, metrics, sites of their IoT devices, and basic client details. [More Info](/pages/client-page.html)

### Device Info Page

The device info page is located at `iot-frontend/src/pages/device-info/[deviceID].tsx`. It displays comprehensive information about a specific device. The page fetches the device ID from the URL using the `fetchDeviceId` function. It requires authentication and uses the `useAuth` hook to check the authentication status. If the user is authenticated, the page displays the device ID, device key, client name, last online timestamp, last ticket created, location, status (scan, battery, insitu), fault identification, metrics, and charts. [More Info](/pages/device-info.html)

### Create Ticket Page

The create ticket page is located at `iot-frontend/src/pages/create-ticket/[createTicket].tsx`. It allows users to create a new ticket for a specific device. The page fetches the device ID from the URL using the `fetchDeviceId` function. It requires authentication and uses the `useAuth` hook to check the authentication status. The page includes a form where users can enter the recipient email addresses (to, cc, bcc), subject, and message. It also displays the device information for reference. Upon form submission, the ticket is created by sending an email using the Resend service. [More Info](/pages/create-ticket.html)

### Login Page

The login page is located at `iot-frontend/src/pages/login/index.tsx`. It serves as the entry point for users to authenticate and access the application. The page displays a simple login form with the Adroit company logo, a welcome message, and a sign-in button. Clicking the sign-in button redirects the user to the authentication page. If a user tries to access protected routes without being authenticated, they are redirected to the login page. [More Info](/pages/login.html)

### Profile Page

The profile page is located at `iot-frontend/src/pages/profile/index.tsx`. It allows authenticated users to view and update their profile information. The page uses the `useAuth` hook to check the authentication status and retrieve the user session. If the user is authenticated, the page displays a form where the user can update their given name, family name, and email address. The form submission is handled by the `handleSubmit` function, which updates the user attributes in AWS Cognito using the `handleUpdateAttribute` function. [More Info](/pages/profile.html)

### Landing Page

The landing page is located at `iot-frontend/src/pages/landing-page/index.tsx`. It serves as the entry point of the application for non-authenticated users. The page provides an overview of the Adroit Manager Frontend application, highlighting its key features and displaying a sample dashboard image. It also includes a login button that redirects users to the authentication page. [More Info](/pages/landing-page.html)

### 404 Page

The 404 page is located at `iot-frontend/src/pages/404.tsx`. It is displayed when a user tries to access a page that doesn't exist. The page provides a user-friendly message indicating that the requested page could not be found and includes a link to return to the home page. [More Info](/pages/404.html)

## Created by Adroit Manager Frontend AUT R&D Team

Many thanks to **AUT** & **Adroit** for the opportunity to work on this project.

| Name          | Student ID | Role                            |
| ------------- | ---------- | ------------------------------- |
| Otis Wales    | 19078635   | Team Leader & Software Engineer |
| Munish Kumar  | 19083476   | Software Engineer               |
| Miguel Emmara | 18022146   | Software Engineer               |
| Glenn Neil    | 21132847   | Software Engineer               |
