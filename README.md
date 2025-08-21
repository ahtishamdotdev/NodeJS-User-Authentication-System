# 🔐 Node Authentication System (MERN Ready)
A simple yet powerful **authentication system** built with **Node.js, Express, MongoDB, and JWT**. This project provides **user registration, login, and authentication APIs**. It is designed as a starting point for MERN projects where user authentication is required. You can also extend it with features like password reset, social logins, or role-based access.

## 🚀 Features
- User Registration (with hashed passwords using bcrypt)
- User Login with JWT Authentication
- MongoDB Integration (Mongoose models)
- Environment Variables using dotenv
- REST API Ready
- Easy to integrate with any frontend (React, Angular, Vue, etc.)
- UI forms (`login.html` and `register.html`) included for quick testing

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT, bcryptjs  
- **Dev Tools:** Nodemon, dotenv  

## 📂 Project Structure
```

node-auth-system/
│
├── src/
│   ├── controllers/    # Auth logic (register, login)
│   ├── models/         # User schema (Mongoose)
│   ├── routes/         # API routes
│   ├── config/         # MongoDB connection
│   └── app.js          # Express app
│
├── server.js           # Entry point
├── .env                # Environment variables
├── package.json
├── nodemon.json
└── README.md

````

## ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/node-auth-system.git
cd node-auth-system
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create a `.env` file

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/authDB
JWT_SECRET=yourSuperSecretKey
```

### 4️⃣ Run the Server

```bash
npm run dev
```

Server will start at 👉 [http://localhost:5000](http://localhost:5000)

## 🔑 API Endpoints

### Test Route

```http
GET /
```

Response: ` API is working!`

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

## 🎨 UI Forms

Basic **HTML + inline CSS** forms are included:

* `public/register.html` → Registration
* `public/login.html` → Login
  You can open these in your browser and test authentication.

## 🤝 Contribution Guide

We welcome contributions! 🎉

1. **Fork** this repository
2. **Clone** your fork

   ```bash
   git clone https://github.com/<your-username>/node-auth-system.git
   ```
3. Create a **new branch**

   ```bash
   git checkout -b feature-branch
   ```
4. Make your changes & commit

   ```bash
   git commit -m "Added new feature"
   ```
5. Push your branch

   ```bash
   git push origin feature-branch
   ```
6. Create a **Pull Request**

## 📜 License

This project is licensed under the **MIT License** – feel free to use, modify, and distribute.

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub. Your support encourages more open-source work ❤️

```


