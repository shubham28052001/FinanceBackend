# ExpanceFinance

A simple Express.js application for user registration, email verification, role-based access control, and administration features using MongoDB.

---

## 🚀 Features

- User registration with name, email, and password
- Password hashing with **bcrypt**
- Email verification via **nodemailer** and temporary tokens
- JWT access and refresh tokens for authentication
- Role-based access (`user`, `admin`)
- Admin APIs to view, block, and unblock users
- Secure middleware: `protect` and `adminOnly`

---

## ⚙️ Prerequisites

- Node.js v14+ installed
- MongoDB database URI
- Google/Gmail account or SMTP service for sending emails
- `.env` configuration (see below)

---

## 🛠️ Installation

1. Clone the repository or download the project files.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root with these variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_ACCESS_KEY=your_jwt_access_secret
   JWT_REFRESH_KEY=your_jwt_refresh_secret
   MAIL_USER=your_gmail_address
   MAIL_PASS=your_gmail_app_password
   CLIENT_URL=http://localhost:5000
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

---

## 🧩 API Endpoints

### 🔐 User Endpoints

#### Register a new user
- **URL:** `/api/users/register`
- **Method:** `POST`
- **Body:** `{ name, email, password }`
- **Description:** Creates a user, hashes the password, generates verification tokens, sends a verification email.
- **Success:** `201` with access token and message about verification email.

#### Verify Email
- **URL:** `/api/users/verify-email?token=<verificationToken>`
- **Method:** `GET`
- **Description:** Called via email link to confirm and activate the account.

#### Resend Verification Email
- **URL:** `/api/users/resend-verification`
- **Method:** `POST`
- **Body:** `{ email }`
- **Description:** Resends verification link if user exists and isn't verified.

#### Login
- **URL:** `/api/users/login`
- **Method:** `POST`
- **Body:** `{ email, password }`
- **Description:** Validates credentials, checks verification & block status, returns tokens.
- **Success:** JSON with `accessToken` and `role`.

---

### 🛡️ Admin Endpoints (Protected & Admin Only)

All admin routes require a valid access token and `role: "admin"`.

- **Get all users:** `GET /api/admin/users`
- **Block user:** `PUT /api/admin/users/block/:id` (cannot block other admins)
- **Unblock user:** `PUT /api/admin/users/unblock/:id`

---

## 📋 Usage Guide

1. **Sign Up**
   - POST to `/api/users/register` with name, email, password.
   - Open verification email and click the link to activate the account.

2. **Login**
   - POST to `/api/users/login` with email & password.
   - Receive access token (15m expiry) and refresh token cookie.

3. **Token Handling**
   - Store access token client-side (e.g. memory/store).
   - Refresh tokens are HTTP‑only cookies; implement a refresh endpoint to renew access tokens.

4. **Admin Actions**
   - Use admin credentials to call admin endpoints for user management.

---

## 📁 Folder Structure

```
ExpanceFinance/
  server.js
  package.json
  README.md
  config/
    db.js
  controller/
    adminController.js
    userController.js
  middleware/
    middleware.js
  models/
    user.js
  nodemailer/
    sendMail.js
  router/
    adminRoute.js
    userRoute.js
```

---

## 📄 License

MIT License
