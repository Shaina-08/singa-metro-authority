# Singa Metro Authority Backend

## Overview
The **Singa Metro Authority Backend** is a robust and scalable backend application designed to support the Singa Metro Authority Backend platform. This backend handles data processing, API management, and database interactions, ensuring a seamless experience for users of the Singa Metro Authority system.

---

## Features
- **API Management**: Provides RESTful APIs for seamless communication between the frontend and backend.
- **Database Integration**: Efficient handling of data using MongoDB.
- **Error Handling**: Comprehensive error reporting and logging for debugging.
- **Scalability**: Designed to handle increasing traffic and data loads efficiently.

---

## Tech Stack
- **Programming Language**: Javascript, TypeScript, Node
- **Framework**: Express
- **Database**: MongoDB
- **Deployment**: ngrok

---

## Installation
Follow these steps to set up the Isnga Metrro Backend locally:

### Prerequisites
- [Node.js](https://nodejs.org/) (version 22 or higher)
- MongoDB installed and running
  

### Steps
1. **Clone the Repository:**
   ```bash
   https://github.com/Shaina-08/singa-metro-authority
   cd singa-metro-authority
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Environment Variables:**
   Create a `.env` file in the root directory and configure it with the following:
   ```env
 
   MONGODB_URI=your_mongodb_connection
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. **Run Database Migrations :**
   ```bash
   npm run migrate
   ```

5. **Start the Server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

---
## API Endpoints

### Journeys
- **POST** `/api/journeys` - Create a new journey
- **GET** `/api/journeys` - Get all journeys
- **GET** `/api/journeys/user/:userId` - Get journeys for a specific user
- **GET** `/api/journeys/:journeyId` - Get details of a specific journey
- **POST** `/api/journeys/bulk` - Bulk create journeys

### Reports
- **GET** `/api/reports/daily` - Fetch daily report
- **GET** `/api/reports/weekly` - Fetch weekly report
- **GET** `/api/reports/line-usage` - Fetch line usage report
- **GET** `/api/reports/peak-hours` - Fetch peak hours report

### Fare Calculation
- **GET** `/api/fare` - Calculate fare for a single journey
- **GET** `/api/fare/bulk` - Calculate fares in bulk

### CSV Management
- **POST** `/api/csv` - Upload and process a CSV file and get fare calculation

---

## Contact
For questions or support, please contact:
- **Name**: Shaina
- **Email**: shainabhard12@gmail.com
- **GitHub**: https://github.com/Shaina-08

---

## Acknowledgments
- Thanks to Peakflo for this oppurtunity.


