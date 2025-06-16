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

### 👔 Managers
- **Team Dashboard** – View and manage team requests
- **Approve/Deny Requests** – Decide with optional denial notes
- **Team Availability** – Set daily max hours available for time off
- **Bulk CSV Upload** – Import team availability
- **Manage Hours** – Assign yearly vacation hours per employee

### 🛠️ Administrators
- **User Management** – Create, update, and delete accounts
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

## 📄 License
This project is licensed under the MIT License. See the `LICENSE` file for details.
