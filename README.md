# APTI_CLUB



# Apti Club – Placement Preparation Platform

Apti Club is a web-based platform designed to help students prepare for campus placements through structured learning, skill development, events, and placement-related activities.

The platform follows the idea **Dream. Discover. Define.** and focuses on helping students build the skills and confidence required to succeed in placements.

## About Apti Club

The name **APTI** represents four important areas of placement preparation:

- **A – Aptitude:** Improve quantitative aptitude, logical reasoning, verbal ability, and problem-solving skills.
- **P – Personality:** Develop communication, confidence, teamwork, and professional skills.
- **T – Technical:** Strengthen programming skills and understand core computer science concepts.
- **I – Interview:** Prepare for technical and HR interviews and learn to present skills and projects confidently.

## Features

- Student registration and login.
- Secure authentication using JSON Web Tokens (JWT).
- Role-based access for students, coordinators, and administrators.
- Events organized under Aptitude, Personality, Technical, and Interview tracks.
- Event registration and cancellation.
- Event capacity and registration deadline validation.
- View registered events.
- Attendance management.
- Admin management of events and coordinator accounts.
- Coordinator access for managing event-related activities.
- About page presenting the club's purpose, tracks, and student contributions.
- Website chatbot to help users find information about Apti Club, events, and learning resources.

## User Roles

### Student
- Create an account and log in.
- Explore published events.
- Register for available events.
- Cancel event registrations.
- View personal registrations.

### Coordinator
- Access the coordinator dashboard.
- Manage assigned event-related activities.
- View registrations for relevant events.
- Manage attendance.

### Administrator
- Access the admin dashboard.
- Create and manage coordinator accounts.
- Create and update events.
- Manage event publishing and status.

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- React Three Fiber
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- MySQL
- mysql2
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- CORS

## Project Structure

```text
apti-site/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   ├── .env
│   └── package.json
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context.jsx
│   ├── api.js
│   ├── data.js
│   ├── App.jsx
│   └── styles.css
│
├── public/
├── .env
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd apti-site
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure the Database

Create a MySQL database named:

```sql
CREATE DATABASE apti_club;
```

Create the required tables for users, events, registrations, and attendance using the project's database schema.

### 5. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=apti_club
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

Create another `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

**Important:** Do not upload `.env` files or expose database passwords and JWT secrets in a public repository.

### 6. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend server runs at:

```text
http://localhost:5000
```

### 7. Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Authentication and Security

- Passwords are hashed using bcryptjs.
- JWT is used for authentication.
- Protected routes require a valid authentication token.
- Role-based authorization controls access to administrative and coordinator operations.
- Environment variables are used for sensitive configuration.

## Database Modules

| Table | Purpose |
|---|---|
| `users` | Stores student, coordinator, and administrator accounts. |
| `events` | Stores event details, categories, schedules, and status. |
| `registrations` | Stores student event registrations. |
| `attendance` | Stores attendance records for registered students. |

## Development Team

Apti Club is developed and maintained by final-year students from the **Computer Science and Engineering (CSE)** and **Information Science and Engineering (ISE)** branches, Batch of **2027**.

The coordinators and curators contribute to the platform's design, development, content, and overall student experience.

## Project Vision

**Dream. Discover. Define.**

Apti Club aims to provide students with a structured environment to discover their strengths, improve their skills, and define their career paths with confidence.

---

*Built with the goal of making placement preparation more organized, accessible, and student-friendly.*

