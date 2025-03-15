# Fixithub Backend

## Overview
Fixithub is a backend service for managing service bookings, providers, and users. It is built using **Node.js, TypeScript, Express, and MongoDB**, following a **clean architecture** approach.

## Project Structure
```
backend/
│   main.ts
├───entities
│   ├───admin
│   ├───common
│   ├───irepositories
│   ├───provider
│   ├───rules
│   ├───services
│   ├───user
├───framework
│   ├───express
│   │   ├───middleware
│   │   └───routes
│   ├───mongo
│   ├───mongoose
│   ├───services
│   └───webSocket
├───interface_adapters
│   ├───controllers
│   └───repositories
└───usecases
    ├───admin
    ├───common
    ├───provider
    └───user
```

## Installation & Setup
### **Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)

### **Installation Steps**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Create a `.env` file in the root directory and add the following:**
   ```ini
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
   CLOUDINARY_CLOUD_NAME=add your
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ACCESSTOKENKEY=your_access_token_key
   REFRESHTOKENKEY=your_refresh_token_key
   BOOKING_FEE_ID=price_1QLIT5E8FyAlBoYVS
   ORIGIN=http://localhost:5173
   SUCCESS_URL=http://localhost:5173/success
   SERVICE_HISTORY=http://localhost:5173/profile/serviceHistory
   ```
4. **Run the development server:**
   ```sh
   npm start
   ```
5. The backend will be running at `http://localhost:3000` (or your configured port).



_For a full list of API endpoints, check the documentation._

## **Technologies Used**
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB
- **Authentication:** JWT
- **File Storage:** Cloudinary
- **Payment Processing:** Stripe


---
**⚠ Security Notice:** Never commit your `.env` file to GitHub! Always keep your API keys and sensitive data secure.

