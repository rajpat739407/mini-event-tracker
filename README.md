# Mini Event Tracker

A full-stack web application for tracking personal events with user authentication and sharing capabilities.

## Features

- User authentication (signup/login)
- Create, read, update, and delete events
- Filter events by upcoming/past
- Share events via public links
- Responsive design for mobile and desktop

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Server runtime and web framework
- **MongoDB** with **Mongoose** - NoSQL database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Validator** - Input validation

### Frontend
- **Next.js** - React framework with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications
- **date-fns** - Date formatting

### Database Choice: MongoDB
I chose MongoDB for this project because:
- **Flexible Schema**: Events can have optional fields like description
- **JSON-like Documents**: Easy to work with JavaScript/Node.js
- **Scalability**: Horizontal scaling is straightforward
- **Developer Experience**: Quick setup and intuitive querying
- **Suitable for the use case**: The data structure is not highly relational

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend