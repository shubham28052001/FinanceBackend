# ExpanceFinance

A simple Express.js application for user registration, email verification, and login using MongoDB.

## Features

- User signup with name, email, and password
- Password hashing with bcrypt
- Email verification using nodemailer and token expiration
- JWT access and refresh tokens for authentication
- Role-based user types (`user`, `admin`)
- Routes for login, email verification, and resending verification email

## Prerequisites

- Node.js v14+ installed
- MongoDB database URI
- Google/Gmail account for sending verification emails
- `.env` file configuration (see below)

## Installation

1. Clone the repository or download the project files.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
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

## API Endpoints

### Register a new user

- **URL:** `/api/users/register`
- **Method:** `POST`
- **Body Parameters:**
  - `name` (string, required, min 3 characters)
  - `email` (string, required, valid email)
  - `password` (string, required, min 6 characters)

- **Description:** Creates a new user account, hashes the password, generates verification tokens, and sends a verification email.
- **Success Response:** `201` with JSON indicating verification email sent and an access token.

### Verify Email

- **URL:** `/api/users/verify-email?token=<verificationToken>`
- **Method:** `GET`
- **Description:** Endpoint users visit through the link in the verification email. Validates the token and marks email as verified.
- **Success Response:** JSON confirming email verification.

### Resend Verification Email

- **URL:** `/api/users/resend-verification`
- **Method:** `POST`
- **Body Parameters:**
  - `email` (string, required)

- **Description:** Sends a new verification email if the user exists and has not been verified.
- **Success Response:** JSON indicating email resent.

### Login

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Body Parameters:**
  - `email` (string, required)
  - `password` (string, required)

- **Description:** Authenticates user credentials, ensures email is verified, issues access and refresh tokens, sets a cookie for refresh token.
- **Success Response:** JSON containing access token and role.

## Usage Guide

1. **Sign up:**
   - Send a POST request to `/api/users/register` with name, email, and password.
   - Check your email for a verification link and open it.
   - After verification, your account is activated.

2. **Login:**
   - Send a POST request to `/api/users/login` with your email and password.
   - On successful login, you'll receive an access token to authenticate subsequent requests.

3. **Token Storage:**
   - Access tokens expire in 15 minutes; use the refresh token stored in a secure http-only cookie to obtain new access tokens (endpoint can be added).

## Folder Structure

```
ExpanceFinance/
  server.js
  package.json
  config/
    db.js
  controller/
    userController.js
  models/
    user.js
  nodemailer/
    sendMail.js
  router/
    userRoute.js
```

## License

MIT License
