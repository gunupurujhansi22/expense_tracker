# Expense Tracker

A full-stack Expense Tracker application built with the MERN stack.

## Features

- Add and manage expenses
- View recorded expenses
- Store expense data in MongoDB
- React-based user interface
- Node.js and Express backend API

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- Vite

## Project Structure

- `Backend/` – Backend server and API
- `Frontend/` – Frontend application

## Prerequisites

- Node.js and npm
- MongoDB connection (local MongoDB or MongoDB Atlas)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/gunupurujhansi22-star/expense_tracker.git
cd expense_tracker
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder with your own configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

Never upload your `.env` file or database password to GitHub.

Start the backend:

```bash
node server.js
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## Environment Variables

Configure your environment variables in the appropriate `.env` file or hosting service settings. Do not commit credentials or secrets.

## License

This project is available for learning and educational purposes.
