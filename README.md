# Employee Management System

## Live Demo
- **Frontend URL**: `<frontend_live_url_placeholder>`
- **Backend Health Check URL**: `<backend_live_url_placeholder>/health`

## Project Overview
This Employee Management System is a production-ready employee management platform designed to help businesses manage their workforce efficiently. It provides a centralized dashboard to track employee statistics and an intuitive workflow to add, view, update, and delete employee records. Built with modern web technologies, it ensures a responsive, reliable, and user-friendly experience.

## Tech Stack
**Frontend**:
- React.js
- Vite
- CSS
- Socket.IO Client

**Backend**:
- Node.js
- Express.js
- Socket.IO

**Database**:
- MongoDB
- Mongoose

## Features
- Dashboard statistics
- Employee CRUD
- Name search
- Department filtering
- Status filtering
- Sorting
- Pagination
- Frontend and backend validation
- Responsive interface
- Loading states
- Empty states
- Error handling
- Toast notifications
- Real-time employee synchronization
- Live dashboard statistics
- Connection status
- Recent activity

## Architecture
**REST Flow (Persistence):**
React UI ↓ REST API ↓ Express Routes ↓ Validation Middleware ↓ Controller ↓ Mongoose ↓ MongoDB

**Socket.IO Flow (Synchronization):**
Successful Database Operation ↓ Socket.IO Event ↓ Connected React Clients ↓ Real-Time UI Update

REST APIs are strictly responsible for data persistence.
Socket.IO is strictly responsible for real-time synchronization. The application continues to function normally if Socket.IO disconnects.

## Folder Structure
```text
.
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── socket.js
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── src/
    │   ├── config/
    │   ├── constants/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   └── index.js
    ├── .env.example
    └── package.json
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Shuvikm/employee-management-system.git
cd employee-management-system
```

### 2. Backend Setup
```bash
cd server
npm install
```
Copy the example environment file and configure your MongoDB connection:
```bash
cp .env.example .env
# Or in PowerShell:
# Copy-Item .env.example .env
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Copy the example environment file:
```bash
cp .env.example .env
# Or in PowerShell:
# Copy-Item .env.example .env
```
Start the development server:
```bash
npm run dev
```

## Environment Variables

### Backend (`server/.env`)
- `PORT`: The port the server runs on (default: 5000)
- `NODE_ENV`: Application environment (`development` or `production`)
- `MONGO_URI`: Your MongoDB connection string
- `CLIENT_URL`: The URL of your frontend application (for CORS)

### Frontend (`client/.env`)
- `VITE_API_URL`: The URL of your backend REST API (default: `http://localhost:5000/api`)
- `VITE_SOCKET_URL`: The URL of your backend Socket.IO server (default: `http://localhost:5000`)

## API Documentation

### GET `/api/health`
Health check endpoint to verify backend status.
- **Response**: `{ "success": true, "message": "Employee Management API is running" }`

### GET `/api/employees`
Get all employees.
- **Query Params**: `search`, `department`, `status`, `sortBy`, `sortOrder`, `page`, `pageSize`
- **Response**: `{ "success": true, "data": [...], "total": 100, "page": 1, "pageSize": 10 }`

### GET `/api/employees/stats`
Get dashboard statistics.
- **Response**: `{ "success": true, "data": { "total": 50, "active": 45, "inactive": 5, "departmentStats": [...] } }`

### GET `/api/employees/:id`
Get a single employee by their ID.
- **Response**: `{ "success": true, "data": { ... } }`

### POST `/api/employees`
Create a new employee.
- **Body**: `full_name`, `email`, `mobile_number`, `department`, `designation`, `joining_date`, `status`.
- **Response**: `{ "success": true, "message": "...", "data": { ... } }`
- **Errors**: `400 Bad Request` (Validation), `409 Conflict` (Duplicate email)

### PUT `/api/employees/:id`
Update an existing employee.
- **Body**: Fields to update.
- **Response**: `{ "success": true, "message": "...", "data": { ... } }`

### DELETE `/api/employees/:id`
Delete an employee.
- **Response**: `{ "success": true, "message": "..." }`

## Socket.IO Events

- `employee:created`: Emitted when a new employee is successfully saved to the database. Payload: `{ data: employeeObject, originClientId: string }`
- `employee:updated`: Emitted when an employee is successfully updated. Payload: `{ data: employeeObject, originClientId: string }`
- `employee:deleted`: Emitted when an employee is successfully deleted. Payload: `{ id: string, originClientId: string }`

## Development Flow
1. **React UI**: The user interacts with the React frontend.
2. **API Service**: `employeeService.js` makes HTTP requests to the backend with `X-Client-ID`.
3. **Express Route**: Backend routes intercept the request.
4. **Validation**: Middleware ensures strict validation.
5. **Controller & Model**: Business logic executes and Mongoose interacts with MongoDB.
6. **Socket Emission**: On successful operation, the server emits real-time events.
7. **UI Update**: The origin client updates via standard REST response; other clients update via Socket.IO events.

## Application Flow
- **Dashboard**: High-level analytics and Recent Activity tracked per session.
- **Employee Listing**: Paginated, sortable, and filterable view of all personnel.
- **Add/Edit**: Forms with strict real-time validation.
- **Delete**: Confirmation modal to prevent accidental data loss.
- **Real-time Synchronization**: List and statistics update without browser refresh when data changes.

## Validation and Error Handling
- **Frontend**: Instant validation feedback, preventing invalid submissions.
- **Backend**: Ultimate source of truth, returning `400 Bad Request` or `409 Conflict` with structured errors.
- **Types Handled**: Duplicate emails, invalid Indian mobile numbers, missing fields.

## Production Considerations
- **Environment variables**: Kept securely out of version control via `.env` files.
- **CORS**: Strictly configured using `CLIENT_URL`.
- **Centralized API configuration**: All HTTP and Socket URLs dynamically adapt using Vite environment variables.
- **Server-side validation**: Protects database integrity against arbitrary requests.
- **Socket.IO reconnection**: The application automatically handles disconnections and reconnects smoothly.
- **REST fallback behavior**: The core CRUD operations remain functional even if Socket.IO fails.

## Assumptions
- Indian 10-digit mobile numbers are required.
- Unique email addresses across the organization.
- Recent Activity is session-based and purely driven by incoming Socket.IO events.
- Socket.IO enhances synchronization and is not responsible for persistence.

## Deployment
1. Set up a MongoDB Atlas cluster and acquire the `MONGO_URI`.
2. **Backend**:
   - Host: Render, Railway, or Heroku
   - Root Dir: `server`
   - Build Command: `npm install`
   - Start Command: `node src/index.js`
   - Env Vars: `MONGO_URI`, `CLIENT_URL`, `NODE_ENV=production`
3. **Frontend**:
   - Host: Vercel, Netlify, or similar
   - Root Dir: `client`
   - Build Command: `npm run build`
   - Output Dir: `dist`
   - Env Vars: `VITE_API_URL` (Backend URL + `/api`), `VITE_SOCKET_URL` (Backend URL)
