# Backend - ResolveIt API

A Node.js/Express.js REST API backend for the ResolveIt case management system.

## Features

- **User Authentication**: JWT-based authentication with Passport.js
- **Role-based Access Control**: Admin and regular user roles
- **Case Management**: Create, update, and manage legal cases
- **File Upload**: Support for user photos and case proof documents
- **Data Validation**: Input validation using ValidatorJS
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing with bcrypt

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport.js
- **File Upload**: Multer
- **Validation**: ValidatorJS
- **Security**: bcrypt for password hashing
- **Environment**: dotenv for configuration

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── caseController.js     # Case management logic
│   └── userController.js     # User authentication logic
├── middlewares/
│   ├── authMiddleware.js     # Authentication & authorization
│   ├── passport.js           # Passport JWT strategy
│   ├── uploadMiddleware.js   # File upload handling
│   └── validationMiddleware.js # Input validation
├── models/
│   ├── caseModel.js          # Case data model
│   └── userModel.js          # User data model
├── uploads/
│   ├── cases/                # Case proof documents
│   └── users/                # User profile photos
├── utils/
│   └── validator.js          # Custom validation utilities
├── .env.copy                 # Environment variables template
├── createAdmin.js            # Admin user creation script
├── index.js                  # Application entry point
├── package.json              # Dependencies and scripts
└── route.js                  # API routes definition
```

## API Endpoints

### Authentication

- `POST /api/register` - User registration with photo upload
- `POST /api/login` - User login

### Case Management

- `POST /api/case/register` - Create new case (authenticated users)
- `POST /api/case/update/verified` - Update case verification status (admin only)
- `POST /api/case/update/opposite` - Update opposite party status (admin only)
- `POST /api/case/update/status` - Update case status (admin only)
- `GET /api/cases/all` - Fetch all cases (admin only)
- `POST /api/cases/user` - Fetch cases by user ID (authenticated users)

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.copy .env
   ```

   Edit `.env` with your configuration:

   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT signing secret
   - `PORT` - Server port (default: 8080)

4. Create an admin user:
   ```bash
   node createAdmin.js
   ```

## Running the Application

### Development

```bash
npm run server
```

Uses nodemon for auto-restart on file changes.

### Production

```bash
npm start
```

The server will start on `http://localhost:8080` (or your configured PORT).

## File Upload

The application supports file uploads for:

- **User Photos**: Stored in `uploads/users/`
- **Case Proofs**: Stored in `uploads/cases/`

Files are served statically at `/uploads` endpoint.

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Models

### User Model

- Personal information (name, email, phone, address)
- Authentication credentials
- Role (user/admin)
- Profile photo

### Case Model

- Case details and description
- Associated user
- Verification status
- Case status and opposite party information
- Proof documents

## License

MIT
