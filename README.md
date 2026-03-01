# Smart Study Group Matching Platform


## Task Description
Smart Study Group Matching & Collaborative Learning Platform
🎯 Objective

The task is to design and develop a full-stack MERN-based web application that helps students find compatible study partners and collaborate effectively through intelligent matching, real-time communication, and structured study management tools.

The system aims to improve academic collaboration by creating organized and productivity-focused study groups instead of random or unstructured communication channels.

🧩 Problem Statement

Students often face several challenges when studying in groups, such as:

Random group formation without compatibility

Lack of structured scheduling

Unorganized group communication

Different study styles and availability

Difficulty in finding suitable study partners

No proper progress tracking system

These problems reduce learning efficiency and collaboration effectiveness.

💡 Proposed Solution

The proposed platform provides an intelligent and structured learning environment by:

Matching students based on subjects, availability, and study style

Allowing users to create and manage study groups

Providing real-time group chat and collaboration tools

Enabling scheduling of study sessions

Tracking learning progress using analytics dashboards

Supporting resource sharing and feedback collection

⚙️ Functional Requirements
1. User Authentication

User registration and login

JWT-based authentication

Secure password encryption using bcrypt

Protected APIs

2. Smart Matching System

Calculate compatibility score between users

Match based on:

Subject similarity

Availability overlap

Study style compatibility

Goal similarity

Return best study partners and groups

3. Study Group Management

Create study groups

Join and manage groups

Set group descriptions and rules

4. Real-Time Chat System

Group messaging using Socket.io

Live message updates

Message history storage

File and notes sharing

5. Study Session Scheduling

Schedule study sessions

Set date and time

Reminder notifications

Conflict checking

6. Progress Tracking

Track study hours

Attendance monitoring

Session count

Weekly achievements and analytics

7. Feedback System

Post-session productivity rating

Cooperation rating

Feedback comments stored for future matching improvement

🧱 Technology Stack

Frontend: React.js, Axios, React Router
Backend: Node.js, Express.js, REST API
Database: MongoDB Atlas with Mongoose
Real-time: Socket.io
Authentication: JWT & bcrypt
File Storage: Cloudinary
Notifications (Optional): Nodemailer
