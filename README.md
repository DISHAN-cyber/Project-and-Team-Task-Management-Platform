# Project and Team Task Management Platform

A full-stack web application developed as part of the **Intern Full Stack Developer** practical assignment for **CyphLab (Private) Limited**.

The platform enables organizations to manage projects, assign tasks, monitor progress, and collaborate efficiently through a secure role-based system.

---

# Tech Stack


https://github.com/user-attachments/assets/a6a32900-32ba-4136-a957-182b547d54ef



## Frontend

* Next.js
* TypeScript
* Tailwind CSS

## Backend

* Node.js
* Express.js
* Prisma ORM

## Database

* PostgreSQL (Neon)

## Deployment

* Frontend: Vercel
* Backend: Railway
* Database: Neon PostgreSQL

## Authentication

* JWT (JSON Web Token)
* Role-Based Access Control (RBAC)

---

# User Roles

## Administrator

* Manage users
* Manage roles
* Create, edit, and delete projects
* Manage project assignments
* View system dashboard
* Monitor overall project progress

## Project Manager

* Create projects
* Assign team members
* Create, update, and delete tasks
* Set task priorities and deadlines
* Track project progress

## Team Member

* View assigned projects
* View assigned tasks
* Update task status
* Add task comments
* Track personal task progress

---

# Features

### Authentication

* Secure Login
* JWT Authentication
* Password Hashing
* Protected Routes
* Role-Based Authorization

### Project Management

* Create Projects
* Update Projects
* Delete Projects
* Assign Team Members
* Project Progress Tracking

### Task Management

* Create Tasks
* Assign Tasks
* Update Task Status
* Set Priority Levels
* Due Date Management

### User Management

* User Registration
* User Profile Management
* Role Management
* Account Status Management

### Dashboard

* Project Statistics
* Task Statistics
* User Statistics
* Progress Overview

### Additional Features

* Responsive Design
* Form Validation
* Error Handling
* Loading Indicators
* Toast Notifications
* RESTful API
* Clean UI
* Secure API Endpoints

---

# Project Structure

```
taskflow/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   ├── hooks/
│   └── types/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   │
│   ├── prisma/
│   └── uploads/
│
└── README.md
```

---

# Database

The application uses **PostgreSQL** hosted on **Neon**.

ORM:

* Prisma ORM

Main Entities

* User
* Role
* Project
* Task
* ProjectMember
* Comment

---

# REST API

Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

Users

```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

Projects

```
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Tasks

```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

# Environment Variables

## Backend (.env)

```
PORT=5000

DATABASE_URL=

JWT_SECRET=

CLIENT_URL=
```

## Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Project-and-Team-Task-Management-Platform.git

cd Project-and-Team-Task-Management-Platform
```

---

## Backend Setup

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# Deployment

## Frontend

Vercel

## Backend

Railway

## Database

Neon PostgreSQL

---

# CI/CD

A basic GitHub Actions workflow is included to automatically:

* Install dependencies
* Run lint checks
* Build the application
* Validate successful compilation

---

# AI Usage

The following AI tools were used during development:

* ChatGPT

  * Project planning
  * Code explanations
  * README documentation
  * Debugging assistance
  * API design suggestions
  * Database relationship guidance

All implementation, testing, customization, and final integration were completed manually.

---

# Documentation

The repository includes:

* README
* Entity Relationship Diagram (ERD)
* Use Case Diagram
* System Architecture Diagram
* API Documentation / Postman Collection
* Feature Completion Report
* CI/CD Workflow Explanation

---

# Live Demo

Frontend

```
https://your-vercel-app.vercel.app
```

Backend

```
https://your-backend.railway.app
```

---

# GitHub Repository

```
https://github.com/YOUR_USERNAME/Project-and-Team-Task-Management-Platform
```

---

# License

This project was developed solely for the **CyphLab (Private) Limited – Intern Full Stack Developer Technical Assessment**.
