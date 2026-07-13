# Employee Management System

A production-grade **Employee Management System** built with **React.js** (frontend) and **Node.js + Express** (backend) with **SQLite** database. Manage your workforce efficiently with a clean, responsive, and intuitive interface.

## 📋 Project Overview

This application allows HR teams and managers to:
- View a dashboard with employee statistics
- List, search, and filter employees
- Add new employees with comprehensive details
- Edit existing employee information
- Delete employees with confirmation
- View detailed employee profiles

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library |
| **React Router v6** | Client-side routing |
| **Vite** | Build tool & dev server |
| **CSS Custom Properties** | Theming & styling |
| **CSS Animations** | Micro-interactions & transitions |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express** | Web framework & REST API |
| **better-sqlite3** | SQLite database driver |
| **SQLite** | Database (zero-config, file-based) |

## ✨ Features

### Dashboard
- **Total Employee Count** - Quick overview of workforce size
- **Active Employees** - Count of currently active employees
- **Inactive Employees** - Count of inactive employees
- **Recent Employees** - Quick access to recently added employees
- **Navigation** - Click any stat card to see filtered results

### Employee Management
- **Add Employee** - Comprehensive form with validation
- **Edit Employee** - Pre-filled form for updates
- **Delete Employee** - Confirmation modal before deletion
- **View Details** - Popup with complete employee information

### Search & Filter
- **Search by Name** - Real-time search with debounce
- **Filter by Department** - Dropdown with all departments
- **Filter by Status** - Active / Inactive toggle
- **Combined Filters** - All filters work together

### Employee Information
- Full Name
- Email Address
- Mobile Number (10-digit Indian format)
- Department (Engineering, Marketing, Sales, HR, etc.)
- Designation (Junior Developer, Manager, Director, etc.)
- Joining Date
- Status (Active / Inactive)

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Loading skeletons & spinners
- Empty states with helpful CTAs
- Toast notifications for CRUD operations
- Form validation with real-time feedback
- Error boundaries & error handling
- Smooth animations & micro-interactions

## 📁 Folder Structure

```
employee-management/
├── README.md
│
├── server/                          # Backend
│   ├── package.json
│   ├── .env
│   ├── data/                        # SQLite database (auto-created)
│   └── src/
│       ├── index.js                 # Express server entry point
│       ├── config/
│       │   └── database.js          # SQLite connection & initialization
│       ├── constants/
│       │   └── index.js             # Centralized constants & enums
│       ├── controllers/
│       │   └── employee.controller.js  # Route handler logic
│       ├── middleware/
│       │   ├── errorHandler.js      # Global error handling
│       │   └── validation.js        # Request validation
│       ├── models/
│       │   └── employee.model.js    # Data access layer
│       ├── routes/
│       │   └── employee.routes.js   # API route definitions
│       └── utils/
│           └── helpers.js           # Utility functions
│
└── client/                          # Frontend
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Root component with routing
        ├── index.css                # Global styles & CSS variables
        ├── api/
        │   └── employeeService.js   # API service layer
        ├── components/
        │   ├── Layout/              # Main layout wrapper
        │   ├── Navbar/              # Side navigation
        │   ├── StatsCard/           # Dashboard stat cards
        │   ├── EmployeeTable/       # Employee data table
        │   ├── EmployeeForm/        # Add/Edit employee form
        │   ├── SearchFilter/        # Search & filter bar
        │   ├── StatusBadge/         # Active/Inactive badge
        │   ├── Modal/               # Reusable modal dialog
        │   ├── LoadingSpinner/      # Loading indicator
        │   ├── EmptyState/          # Empty data state
        │   └── Toast/               # Toast notifications
        ├── constants/
        │   └── index.js             # Centralized constants
        ├── pages/
        │   ├── Dashboard/           # Dashboard page
        │   ├── EmployeeList/        # Employee listing page
        │   ├── AddEmployee/         # Add employee page
        │   └── EditEmployee/        # Edit employee page
        └── utils/
            ├── helpers.js           # Utility functions
            └── validation.js        # Form validation rules
```

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/employee-management.git
cd employee-management
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
The server will start on **http://localhost:5000**.

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
The client will start on **http://localhost:5173**.

### 4. Access the Application
Open your browser and navigate to **http://localhost:5173**.

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
```
GET /api/health
```
Response: `{ "success": true, "message": "Server is running", "timestamp": "..." }`

#### Get All Employees
```
GET /api/employees
```
Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search employees by name |
| `department` | string | Filter by department |
| `status` | string | Filter by status (Active/Inactive) |

Response: `{ "success": true, "data": [...], "count": 10 }`

#### Get Employee Statistics
```
GET /api/employees/stats
```
Response: `{ "success": true, "data": { "total": 10, "active": 8, "inactive": 2 } }`

#### Get Departments
```
GET /api/employees/departments
```
Response: `{ "success": true, "data": ["Engineering", "Marketing", ...] }`

#### Get Employee by ID
```
GET /api/employees/:id
```
Response: `{ "success": true, "data": { ... } }`

#### Create Employee
```
POST /api/employees
```
Request Body:
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "mobile_number": "9876543210",
  "department": "Engineering",
  "designation": "Senior Developer",
  "joining_date": "2024-01-15",
  "status": "Active"
}
```
Response: `{ "success": true, "message": "Employee created successfully", "data": { ... } }`

#### Update Employee
```
PUT /api/employees/:id
```
Request Body: Same as Create
Response: `{ "success": true, "message": "Employee updated successfully", "data": { ... } }`

#### Delete Employee
```
DELETE /api/employees/:id
```
Response: `{ "success": true, "message": "Employee deleted successfully" }`

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 404 | Not Found |
| 500 | Internal Server Error |

### Validation Rules
| Field | Rules |
|-------|-------|
| `full_name` | Required, 2-100 characters |
| `email` | Required, valid email format |
| `mobile_number` | Required, 10 digits starting with 6-9 |
| `department` | Required, must be from predefined list |
| `designation` | Required, must be from predefined list |
| `joining_date` | Required, valid date |
| `status` | Required, must be "Active" or "Inactive" |

## 💻 Development Flow

1. **Backend first**: Start the Express server to initialize the SQLite database
2. **API testing**: Test endpoints using the API documentation above
3. **Frontend development**: The Vite dev server with proxy configuration forwards `/api` requests to the backend
4. **Build for production**: Run `npm run build` in the client directory to generate optimized static files

## 🔄 Application Flow

```
User → Dashboard (Stats Overview)
  ↓
Employee List (Search, Filter, View)
  ↓
Add Employee → Form Validation → Create API → Redirect to List
Edit Employee → Form Validation → Update API → Redirect to List
Delete Employee → Confirmation Modal → Delete API → Update List
```

## 🤔 Assumptions

- **Mobile Numbers**: Indian mobile number format (10 digits starting with 6-9) is used
- **Departments & Designations**: Predefined lists are maintained centrally; new items require code changes
- **Database**: SQLite is used for zero-configuration setup; for production, consider migrating to PostgreSQL
- **Single User**: The application does not include authentication/authorization
- **Data**: All timestamps are stored in UTC
- **No Pagination**: Full result set is returned; for large datasets, implement server-side pagination

## 📦 Production Deployment

### Backend Deployment
```bash
cd server
NODE_ENV=production PORT=5000 node src/index.js
```

### Frontend Build
```bash
cd client
npm run build
```
The built files will be in the `client/dist/` directory, ready to be served by any static file server or the Node.js backend.

## 📄 License

MIT
