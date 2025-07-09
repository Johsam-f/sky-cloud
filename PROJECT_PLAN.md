# 🌤️ Sky Cloud – Project Plan

## 📌 Project Overview

**Sky Cloud** is a secure and user-friendly file uploader web application that allows users to upload, manage, and share their files in the cloud. It includes authentication, role-based access, and file visibility controls.

---

## ✅ Project Requirements

### 🔐 1. User Authentication & Security

- User registration (sign up)
- User login/logout
- Password hashing (e.g., bcrypt)
- User session management
- Role-based access (user, admin)
- Input validation (e.g., express-validator)
- Protect private routes (middleware)
- Rate limiting to prevent abuse
- Use security middleware (e.g., helmet) .. not sure if i am going to use or not

---

### ☁️ 2. File Upload System

- Allow file uploads (via multer)
- Restrict file size (e.g., max 10MB)
- Restrict file types (e.g., .jpg, .png, .pdf, etc.)
- Store files with unique names or UUIDs
- Save metadata to the database (filename, size, type, user, etc.)

---

### 🗃️ 3. File Management (User)

- View uploaded files in a dashboard
- Delete files
- Download files
- Rename files (optional)
- Display file info (name, size, type, upload date)

---

### 🔗 4. File Sharing

- Mark files as public or private
- Generate shareable links for public files
- Set optional expiration for shared links (optional)
- Prevent unauthorized access to private files

---

### 🛠️ 5. Admin Dashboard

- View all users
- View all uploaded files
- Delete any user or file
- Ban or suspend users (optional)

---

### 🧑‍💼 6. User Dashboard

- View list of their files
- Actions per file: delete, download, rename, share
- See file status (public/private)

---

### 🏗️ 7. System Infrastructure

- PostgreSQL database
- Local filesystem storage (MVP)
- Organize uploads into user-specific directories (optional)
- Prepare for switch to cloud storage (e.g., AWS S3)

---

### 🎨 8. UI & UX (EJS Frontend)

- Clean, responsive design (Tailwind CSS)
- Login/signup forms with feedback
- Dashboard with clear file display
- Status messages (upload success/error)

---

### ⚠️ 9. Error Handling & Feedback

- Handle upload errors (size/type issues)
- Handle auth errors (invalid login, unauthorized access)
- User-friendly messages for all actions

---

### 🚀 10. Stretch Goals (Optional)

- Upload folders (as .zip or recursively)
- Tag or categorize files
- Show upload progress bar
- Email notifications for shares/logins
- API version for mobile or SPA use

---
