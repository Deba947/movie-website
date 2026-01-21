# 🎬 Movie Management Application (MERN Stack)

A full-stack Movie Management web application built using the **MERN stack** with **Admin & User roles**, **image uploads**, **pagination**, **search**, and **secure authentication**.

---

## 🚀 Live Demo
- Frontend: https://your-frontend-url.vercel.app
- Backend API: https://your-backend-url.railway.app

---

## 🛠 Tech Stack

### Frontend
- React.js
- Material UI
- React Router
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- Multer
- Cloudinary (Image Hosting)

---

## ✨ Features

### 👤 User
- Browse movies
- Search & sort movies
- View movie details with scene gallery

### 🔐 Admin
- Secure admin login
- Add, edit, delete movies
- Upload poster & scene images
- Manage users
- Pagination & filters
- Protected routes

---

## 📂 Project Structure
```bash
movie-app/
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   └── App.jsx
│
└── README.md


⚙️ Environment Variables
Backend .env
PORT=4000
JWT_SECRET=your_secret_key
MONGODB_URI=your_mongodb_uri

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx


Frontend .env

REACT_APP_API_URL=http://localhost:4000



▶️ How to Run Locally

git clone https://github.com/your-username/movie-app.git
cd movie-app


2️⃣ Backend Setup

cd backend
npm install
npm run dev

Backend runs on: http://localhost:4000


3️⃣ Frontend Setup

cd frontend
npm install
npm start


Frontend runs on:

http://localhost:3000


☁️ Deployment
Frontend

Deployed on Vercel / Netlify

Backend

Deployed on Railway / Render

Database

MongoDB Atlas


🧪 Testing

API tested using Postman

Authentication using JWT

📌 Author

Debanjan Mondal
MERN Stack Developer
GitHub: https://github.com/your-username

LinkedIn: https://linkedin.com/in/your-profile

⭐ Future Improvements

Movie reviews & ratings

Watchlist feature

Role-based permissions

Better caching