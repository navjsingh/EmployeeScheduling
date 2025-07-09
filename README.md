# 🌴 Vacation & Leave Management System

A full-stack web application designed to streamline the process of requesting, approving, and tracking employee vacation time. This system provides a clean and intuitive interface for employees, managers, and administrators — each with role-specific dashboards and workflows.

**Live Demo:** _Coming soon_

---

## ✨ Key Features

### 👤 Employees
- **Calendar View** – Visualize personal and team vacation schedules
- **Request Time Off** – Submit single or multi-day vacation requests
- **Track Request Status** – View pending, approved, or denied requests
- **Vacation Balance** – Monitor used and remaining vacation hours
- **Cancel Requests** – Withdraw pending time-off requests
- **Team View** – See team members and their vacation schedules

### 👔 Managers
- **Team Dashboard** – View and manage team requests
- **Approve/Deny Requests** – Decide with optional denial notes
- **Team Availability** – Set daily max hours available for time off
- **Bulk CSV Upload** – Import team availability
- **Manage Hours** – Assign yearly vacation hours per employee
- **Team Members** – View and manage team members

### 🛠️ Administrators
- **Team Overview** – Default homepage showing all teams with clickable team cards
- **User Management** – View all users with advanced filtering (team, role, search) and clickable user details
- **Team Details** – Click on teams to see managers and employees.
- **Team Management** – Create, edit, and delete teams with proper validation and error handling
- **CSV Import** – Bulk import/update users with file upload and create/update modes
- **Vacation Calendar** – Calendar view with team/manager selection dropdowns and conditional display
- **Team Schedule** – Hour-by-hour schedule view with employees on rows and 24-hour day columns with horizontal scrolling

- **User Details Modal** – Comprehensive user editing with role, team, and vacation hour management
- **Role Assignment** – Promote/demote users (Employee / Manager / Admin)
- **Attribute Editing** – Update user name, email, and hour limits

---

## 🧱 Tech Stack & Architecture

### 🖥️ Frontend
- **Framework:** React (with Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API

### ⚙️ Backend
- **Framework:** Spring Boot (Java 24+)
- **Database:** PostgreSQL
- **Authentication:** Spring Security + JWT
- **Persistence:** Spring Data JPA (Hibernate)

### 🚀 Deployment
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Hosting:** Google Cloud Run
- **Registry:** Google Artifact Registry

> On push to `main`, GitHub Actions builds and tests both apps, pushes Docker images to Artifact Registry, and deploys them to Cloud Run.

---

## 🧪 Getting Started (Local Development)

### ✅ Prerequisites
- Java 24+
- Maven
- Node.js + npm
- PostgreSQL
- Docker (optional, for container testing)

### 🔐 Default Login Credentials
- **Admin:** `admin@company.com` / `changeme123`
- **Manager:** `manager@company.com` / `changeme123`
- **Employee:** `employee@company.com` / `changeme123`

---

### Backend Setup

1. **Create PostgreSQL Database:**
    - Open `psql` or a GUI tool like pgAdmin.
    - Create a new database named `vacationdb`.

2. **Configure Credentials:**

    - Navigate to the `/backend` directory.
    - Open `src/main/resources/application.properties`.
    - Update `spring.datasource.username` and `spring.datasource.password` with your PostgreSQL credentials.
    - Set a long, random string for `app.jwt.secret`.

3. **Run the Backend:**
    - Open the `/backend` directory in your IDE.
    - Run the `VacationManagerApplication.java` file.
    - The backend will start on `http://localhost:8080`. 
    - The first run will automatically create all necessary tables in 
    your database and seed it with sample data.

### Frontend Setup

1. **Install Dependencies:**
    - Navigate to the `/frontend` directory in your terminal.
    - Run `npm install` (or `npm i`).

2. **Run the Frontend:**
    - Run `npx vite`.
    - The application will be available at `http://localhost:5173`.

## 📊 CSV Import Format

Administrators can bulk import users using CSV files with the following format:

```csv
name,email,team,managerEmail,role,totalVacationHours
John Doe,john.doe@company.com,Red,jane.smith@company.com,EMPLOYEE,160
Jane Smith,jane.smith@company.com,Red,,MANAGER,200
Alice Johnson,alice.johnson@company.com,Blue,jane.smith@company.com,EMPLOYEE,160
```

### CSV Fields:
- **name**: Full name of the employee (required)
- **email**: Email address, must be unique (required)
- **team**: Team name (Red, Blue, Green, Yellow, etc.) - teams are created automatically
- **managerEmail**: Email of the manager (optional) - must be an existing user
- **role**: EMPLOYEE, MANAGER, or ADMIN (defaults to EMPLOYEE if not specified)
- **totalVacationHours**: Number of vacation hours per year (defaults to 160 if not specified)

### Error Handling:
- Comprehensive error handling for all operations
- User-friendly error messages for team deletion with members
- Proper validation for CSV imports with detailed success/error reporting
- Loading states and processing indicators for all async operations

### Import Modes:
- **Create New Users Only**: Only creates new users, skips existing ones
- **Update Existing Users**: Only updates existing users, skips non-existent ones

### Features:
- File upload support for CSV files
- Teams are automatically created if they don't exist
- Manager relationships are properly established
- Comprehensive import results with success/error details
- Template download functionality
- Real-time data refresh after operations
- Responsive design with proper loading states

## 🚀 Recent Updates

### Latest Features (v2.0)
- **Enhanced Team Management**: Improved team creation, editing, and deletion with proper validation
- **User Details Modal**: Clickable user rows with comprehensive editing capabilities
- **Improved Vacation Calendar**: Team and manager selection dropdowns with conditional display
- **Optimized Team Schedule**: Shows all teams by default with proper filtering and 24-hour day columns
- **Better Error Handling**: User-friendly error messages and loading states throughout the application
- **Performance Improvements**: Optimized data fetching and reduced unnecessary API calls

## 📄 License
This project is licensed under the MIT License. See the `LICENSE` file for details.