# Smart Study Group Matching & Collaborative Learning Platform

A full-stack MERN application to intelligently match students into productive study groups and support collaborative learning with real-time chat, scheduling, analytics, and feedback.

## Core Features

- **JWT Authentication** with bcrypt password hashing.
- **Smart Matching Engine** using compatibility scoring for subjects, availability, goals, and study style.
- **Study Group Management** (create, list, join, rules and descriptions).
- **Real-Time Group Chat** with Socket.io and persistent message history.
- **Study Session Scheduling** with conflict checking and optional reminder notifications via Nodemailer.
- **Progress Tracking Analytics** (hours, attendance, weekly achievements).
- **Feedback System** (productivity/cooperation ratings + comments).
- **Collaborative Task Board** for group todo/in-progress/done workflows with assignees and due dates.
- **Group Leaderboard** ranking members by study hours and peer feedback scores.
- **Group Audio/Video Calls** using instant Jitsi room links for each study group.
- **Live Time Display** in group workspace for schedule awareness.
- **File Upload in Group Chat** for sharing notes/resources directly in conversations.
- **Group Capacity Auto-Close** to stop joins once max member count is reached.
- **Announcement Board** (new) for owner-posted notices visible to all members.
- **Resource Sharing Ready** using Cloudinary upload endpoint.

## Tech Stack

- **Frontend:** React, React Router, Axios, Socket.io-client, Vite
- **Backend:** Node.js, Express, MongoDB Atlas + Mongoose, Socket.io
- **Auth:** JWT + bcryptjs
- **Storage/Notifications:** Cloudinary, Nodemailer

## Project Structure

- `server/` – REST API, Socket.io server, Mongo models/controllers/routes
- `client/` – React UI for auth, matching dashboard, groups, and chat

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `server/.env` (or copy from `server/.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<url_encoded_password>@cluster0.t2mg76e.mongodb.net/smart_study_platform?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=super_secret

# Optional integrations
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

> If your password contains special characters (for example `@`), URL-encode it in `MONGO_URI`.
> Example: `Mathi@5665` becomes `Mathi%405665`.

Create `client/.env` (optional):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3) Run development

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Main API Endpoints

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/matching`
- `GET/POST /api/groups`, `POST /api/groups/:groupId/join`, `PATCH /api/groups/:groupId/settings`
- `GET /api/groups/:groupId/announcements`, `POST /api/groups/:groupId/announcements`
- `GET /api/groups/:groupId/call`, `POST /api/groups/:groupId/call/:callType` (`callType` = `audio` or `video`)
- `GET /api/chat/:groupId/messages`, `POST /api/chat/upload` (multipart with `resource` + `groupId`)
- `POST /api/sessions`, `PATCH /api/sessions/:sessionId/attendance`, `GET /api/sessions/analytics/me`
- `POST /api/feedback`, `GET /api/feedback/user/:userId`
- `GET/POST /api/tasks/group/:groupId`, `PATCH /api/tasks/:taskId/status`, `PATCH /api/tasks/:taskId/assign`
- `GET /api/sessions/leaderboard/:groupId`

## Socket Events

- `join-group` – join a group room
- `group-message` – send/receive group messages in real time

