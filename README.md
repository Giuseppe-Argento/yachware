
Project Setup and Running Instructions

Installation

To get started with the project, follow these steps:

Install Dependencies Navigate to both the dashboard-app and analytics-app folders and install the necessary dependencies by running the following command in each folder:

npm i

Running the Project

1. Start the Dashboard App

Open the dashboard-app folder in an integrated terminal.

Start the server by running:

node server.js

Run the application with:

npm run dev

The project will open on localhost:3000.

2. Start the Analytics App

Open the analytics-app folder in an integrated terminal.

Start the application by running:

npm run dev

(The project will run  on localhost:3001 - for micro frontend example).

Your project should now be running completely successfully!


# YanchWare Smart Home Hub

## Overview

YanchWare is entering the smart home market with the **Smart Home**, a central dashboard that allows users to control and monitor their connected devices. This application provides a seamless and intuitive interface to interact with smart home devices, ensuring a futuristic and connected living experience.

## Application Architecture and Technology Choices

### Architecture

- **Frontend:** Built using React.js with Next.js for Server-Side Rendering (SSR).

- **Backend:** Next.js API routes for handling API requests and WebSockets for real-time updates.

- **State Management:** Redux Toolkit for managing application state efficiently.

- **Data Storage:** Faker.js is used to generate mock data dynamically for testing and development purposes.

- **Microfrontend Structure:** The dashboard is split into independent microfrontends using **Next.js Zones**, integrating `dashboard-app` and `analytics-app` for modular development and scalability.

### Technology Stack

- **UI Components:** Uses shadcn/ui for prebuilt and customizable UI components.

- **Programming Languages:** TypeScript, JavaScript.

- **Frontend Frameworks:** React, Next.js, TailwindCSS.

- **Backend Frameworks:** Next.js API routes.

- **State Management:** Redux Toolkit.

- **Real-Time Communication:** WebSockets for live updates on device statuses.

- **Testing:** Cypress.

## Design Decisions and User Experience Considerations

### UI/UX Design Principles

- **Interactive Dashboard:** A visually appealing and intuitive interface to monitor and control devices, based on cards devices.
- **Responsiveness:** Optimized for various screen sizes.
- **Dark/Light Mode:** Implement a toggle for switching between dark and light modes to enhance usability.
- **Customizable Layout:** Users can personalize their dashboard layout (drag & drop widgets).
- **Real-Time Data Updates:** Device states update instantly through Redux.
- **Data Visualization:** Historical trends displayed using chart.

### Key Features

- **Device Control:** Turn devices on/off, adjust thermostat temperature, control brightness and volume.
- **Grouping by Location/Type:** Organize devices efficiently.

## Potential Future Features and Improvements

### Roadmap

- **Energy Consumption Tracking:** Implementation of a modality for optimizing consumption.
- **Settings for Device Patterns:** Create a setting to instantly set all devices to a predefined pattern.




.

