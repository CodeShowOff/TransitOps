# TransitOps - Fleet Management System

TransitOps is a comprehensive Fleet Management System designed to streamline and manage all operations related to vehicles, drivers, trips, maintenance, and fuel expenses. Built with a modern web stack, it provides role-based access control, real-time analytics, and an intuitive dashboard for different types of users within a fleet organization.

## Features

- **Role-Based Access Control (RBAC):** Tailored dashboards and permissions for Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts.
- **Vehicle Management:** Track vehicle status, capacity, region, and odometer readings.
- **Driver Management:** Manage driver profiles, licenses, safety scores, and availability.
- **Trip Management:** Dispatch trips, validate capacities, track distances, and monitor trip statuses from draft to completion.
- **Maintenance Tracking:** Log vehicle maintenance services, track costs, and update vehicle status automatically.
- **Fuel & Expenses:** Record fuel logs and various trip expenses to calculate operational costs.
- **Analytics Dashboard:** Monitor fleet utilization, fuel efficiency, ROI, and operational costs in real-time.

## Tech Stack

### Frontend
- **React (via Vite):** Fast and modern UI development.
- **Tailwind CSS & shadcn/ui:** Styling and component library for a premium look.
- **React Router DOM:** Client-side routing.
- **Axios:** API requests.
- **Recharts:** Interactive charts for analytics.

### Backend
- **Node.js & Express:** RESTful API backend.
- **MongoDB & Mongoose:** NoSQL database and Object Data Modeling.
- **JWT (JSON Web Tokens):** Secure authentication and authorization.
- **bcryptjs:** Password hashing.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **MongoDB** (running locally or a MongoDB Atlas URI)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TransitOps
```

### 2. Backend Setup

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
```

#### Configuration
Create a `.env` file in the root of the `server` directory and add the following environment variables. You can customize them based on your local setup:

```env
# server/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/transitops
JWT_SECRET=your_super_secret_jwt_key_here
```

#### Database Seeding (Optional)
To populate the database with initial users and roles, you can run the seed scripts:

```bash
# To seed Admin user only
npm run seed

# To seed all initial data (users, mock vehicles, etc., if configured)
npm run seed:all
```

#### Start the Backend Server
```bash
npm run dev
```
The server will start running on `http://localhost:5000` (or the port you specified).

### 3. Frontend Setup

Open a new terminal window and navigate to the `client` directory:

```bash
cd client
npm install
```

#### Configuration
By default, the React client is configured to communicate with the backend at `http://localhost:5000/api`. If your backend runs on a different port, you will need to update the base URL in the frontend service files (located in `client/src/services/`).

#### Start the Frontend Development Server
```bash
npm run dev
```
Vite will start the development server, usually accessible at `http://localhost:5173`. Open this URL in your browser to view the application.

## User Roles & Permissions

The application supports multiple roles, each with specific sidebar navigation and data access:

- **Fleet Manager:** Full access to all modules (Dashboard, Fleet, Drivers, Trips, Maintenance, Fuel, Analytics, Settings).
- **Dispatcher:** Can manage Trips and view Dashboard, Fleet (read-only), and Drivers (read-only).
- **Safety Officer:** Can manage Drivers and view Dashboard and Trips (read-only).
- **Financial Analyst:** Access to Dashboard, Fuel logs, and Analytics.

## License

This project is licensed under the ISC License.
