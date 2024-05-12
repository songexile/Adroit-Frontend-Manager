# Introduction 🎉

Presenting Adroit Frontend Manager dashboard application developed with React, NextJS 14, TypeScript, shadcn/ui, and TailwindCSS. This dashboard was developed as part of a AUT Research and Development project which spanned from 2023-2024.

The primary aim of the project was to solve Adroit's business problem in which they had to rely on emails to see which devices were offline.


## Key Features

The IoT Manager Frontend project aims to provide a comprehensive tool for the delivery team at Adroit Environmental IoT to monitor their sensors and devices effectively. The key features of the project include:

- Sensor Status Monitoring
- Battery Health Monitoring
- Ticketing System
- User Authentication
- Fault Identification
- Additional Features **(Not Implemented)**
    - Heat Maps so that users can see a comprehensive view of all the devices
    - Database to see how battery health degrades

## Pages

### Dashboard

This page is at the root currently `localhost:3000` on this page users can view a comprehensive view of all IoT devices which are offline. 

This data is fetched from an **AWS S3 bucket** which is updated by a AWS Lambda script every 6 hours.


The dashboard contains filtering and allows users to see the most recent offline devices, client name, client ID, device key, battery percentage as well as battery voltage.

On the left side of the screen, the user can click the three dots menu, this menu allows the user to **view in-depth statistics**, **create a ticket** or **view the client's devices.**


## Initialy Made By

Otis Wales - 19078635 - Team Leader
<br>
Munish Kumar - 19083476 - Software Engineer
<br>
Miguel Emmara - 18022146 - Software Engineer
<br>
Glenn Neil - 21132847 - Software Engineer
