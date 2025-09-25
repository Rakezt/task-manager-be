# Task Management Backend API

This is a **Node.js/Express.js** backend for a task management application with user authentication, task CRUD operations, and avatar upload using **Cloudinary**. The backend uses **MongoDB** as the database.

---

## Features

* User signup and login with **JWT authentication**
* Role-based access (`user` and `admin`)
* CRUD operations for tasks
* Change task status (`pending`, `in-progress`, `completed`)
* Upload user avatars to Cloudinary
* Secure API endpoints using JWT

---

## Folder Structure

```
backend/
├── config/
│   └── cloudinary.js        # Cloudinary configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── task.js              # Task model
│   └── taskuser.js          # User model
├── routes/
│   ├── auth.js              # Authentication and avatar routes
│   └── task.js              # Task CRUD routes
├── .env                     # Environment variables
├── server.js                # Entry point
├── package.json
└── README.md
```

---

## Environment Variables (.env)

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

---

## Installation

1. Clone the repository:

```bash
git clone <repo_url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the template above.

4. Run the server (development):

```bash
npm run dev
```

5. Run the server (production):

```bash
npm start
```

The server will run on `http://localhost:5000` (or the PORT specified in `.env`).

---

## API Endpoints

### Auth Routes (`/api/auth`)

* **POST /signup**: Create a new user
* **POST /login**: Login user and get JWT
* **POST /upload-avatar**: Upload avatar (requires auth)
* **GET /me**: Get current user info (requires auth)

### Task Routes (`/api/task`)

> All routes require JWT authentication

* **GET /**: Get all tasks (admin) or user tasks (user)
* **POST /**: Create a new task
* **PUT /:id**: Update task by ID
* **DELETE /:id**: Delete task by ID
* **PATCH /:id/status**: Update task status

---

## Technologies Used

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT Authentication
* Bcrypt for password hashing
* Cloudinary for image storage
* Multer for file upload
* CORS enabled

---

## Deployment

This project can be deployed to **Render**, **Heroku**, or any Node.js hosting provider.

* Ensure `.env` variables are set on the hosting provider.
* Use `npm start` as the start command.

---

## Notes

* Admin users can manage all tasks.
* Normal users can manage only their own tasks.
* Passwords are securely hashed.
* Avatar uploads are stored in Cloudinary and URL saved in MongoDB.
* Make sure to whitelist allowed origins in CORS if connecting from a frontend.

---

## Postman Testing

1. Use `POST /api/auth/signup` to create a user.
2. Use `POST /api/auth/login` to get a JWT token.
3. Include `Authorization: Bearer <token>` in headers for protected routes.
4. Test task CRUD operations using `/api/task` endpoints.
5. Upload avatar using `POST /api/auth/upload-avatar` with form-data `avatar` field.

---

## License

MIT License
