# ResolveIt - Case Management System

A full-stack web application for managing legal cases with user authentication, role-based access control, and file upload capabilities.

## Overview

ResolveIt is a comprehensive case management system that allows users to register legal cases and enables administrators to manage and track case progress. The system features a React frontend and a Node.js/Express backend with MongoDB database.

## Features

### User Features

- **User Registration & Authentication**: Secure user registration with profile photo upload
- **Case Registration**: Create and submit legal cases with supporting documents
- **Personal Dashboard**: View and manage personal cases
- **File Upload**: Upload case proofs and supporting documents
- **Real-time Notifications**: Get instant feedback on actions

### Admin Features

- **Admin Dashboard**: Comprehensive view of all cases in the system
- **Case Management**: Update case verification status, opposite party status, and overall case status
- **User Management**: Oversee all registered users
- **Document Review**: Access and review uploaded case documents

### Technical Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for users and administrators
- **File Upload & Storage**: Secure file handling with Multer
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **RESTful API**: Well-structured API endpoints

## Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Efficient form handling
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **Multer** - File upload handling
- **bcrypt** - Password hashing
- **ValidatorJS** - Input validation

## Project Structure

```
ResolveIt/
├── backend/                  # Node.js/Express API server
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middlewares/         # Custom middleware
│   ├── models/              # Database models
│   ├── uploads/             # File upload storage
│   ├── utils/               # Utility functions
│   ├── .env.copy           # Environment variables template
│   ├── createAdmin.js      # Admin creation script
│   ├── index.js            # Server entry point
│   ├── package.json        # Backend dependencies
│   ├── README.md           # Backend documentation
│   └── route.js            # API routes
├── frontend/                # React client application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   │   ├── admin/      # Admin components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── cases/      # Case management components
│   │   │   └── dashboard/  # Dashboard components
│   │   ├── lib/            # Utility libraries
│   │   ├── App.js          # Main app component
│   │   └── index.js        # App entry point
│   ├── package.json        # Frontend dependencies
│   ├── README.md           # Frontend documentation
│   └── tailwind.config.js  # Tailwind configuration
└── README.md               # This file
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ResolveIt
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   npm install
   cp .env.copy .env
   # Edit .env with your configuration
   node createAdmin.js  # Create admin user
   npm run server       # Start development server
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   # Create .env file with REACT_APP_API_URL=http://localhost:8080/api
   npm start           # Start development server
   ```

### Environment Configuration

#### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/resolveit
JWT_SECRET=your-super-secret-jwt-key
PORT=8080
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## API Endpoints

### Authentication

- `POST /api/register` - User registration
- `POST /api/login` - User login

### Case Management

- `POST /api/case/register` - Create new case
- `GET /api/cases/all` - Get all cases (admin)
- `POST /api/cases/user` - Get user's cases
- `POST /api/case/update/verified` - Update verification status (admin)
- `POST /api/case/update/opposite` - Update opposite status (admin)
- `POST /api/case/update/status` - Update case status (admin)

## User Roles

### Regular User

- Register and login
- Create and submit cases
- View personal cases
- Upload case documents

### Administrator

- All user permissions
- View all cases in the system
- Update case verification status
- Manage opposite party information
- Update overall case status

## Development

### Running in Development Mode

**Backend:**

```bash
cd backend
npm run server  # Uses nodemon for auto-restart
```

**Frontend:**

```bash
cd frontend
npm start      # Runs on http://localhost:3000
```

### Building for Production

**Frontend:**

```bash
cd frontend
npm run build  # Creates optimized build
```

**Backend:**

```bash
cd backend
npm start      # Production server
```

## File Upload

The system supports file uploads for:

- **User Profile Photos**: Stored in `backend/uploads/users/`
- **Case Proof Documents**: Stored in `backend/uploads/cases/`

Supported file types: Images (JPG, PNG, GIF) and Documents (PDF)

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: File type and size restrictions
- **CORS Configuration**: Proper cross-origin resource sharing setup

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the individual README files in backend and frontend directories for more details.

## Support

For support and questions:

- Check the individual README files in `backend/` and `frontend/` directories
- Review the API documentation
- Check the project issues on GitHub

## Roadmap

- [ ] Email notifications for case updates
- [ ] Advanced search and filtering
- [ ] Case status tracking timeline
- [ ] Document preview functionality
- [ ] Mobile app development
- [ ] Integration with external legal databases
