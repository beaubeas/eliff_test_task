# Frontend - ResolveIt Client

A React.js frontend application for the ResolveIt case management system.

## Features

- **User Authentication**: Login and registration with JWT token management
- **Role-based Access**: Different interfaces for users and administrators
- **Case Management**: Create and manage legal cases with file uploads
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **Protected Routes**: Route protection based on authentication and roles
- **Real-time Notifications**: Toast notifications for user feedback
- **Form Handling**: React Hook Form for efficient form management

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **State Management**: React Hooks + Context
- **Cookie Management**: js-cookie

## Project Structure

```
frontend/
├── public/
│   └── index.html            # HTML template
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminDashboard.js    # Admin panel interface
│   │   ├── auth/
│   │   │   ├── Login.js             # User login form
│   │   │   └── Register.js          # User registration form
│   │   ├── cases/
│   │   │   └── CaseRegister.js      # Case creation form
│   │   ├── dashboard/
│   │   │   └── Dashboard.js         # User dashboard
│   │   ├── Home.js                  # Landing page
│   │   └── ProtectedRoute.js        # Route protection component
│   ├── lib/
│   │   ├── api.js                   # API configuration and helpers
│   │   └── auth.js                  # Authentication utilities
│   ├── App.js                       # Main application component
│   ├── index.js                     # Application entry point
│   └── index.css                    # Global styles and Tailwind imports
├── .eslintrc.json            # ESLint configuration
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## Routes

### Public Routes

- `/` - Home/Landing page
- `/auth/login` - User login
- `/auth/register` - User registration

### Protected Routes (Authenticated Users)

- `/dashboard` - User dashboard
- `/case/register` - Create new case

### Admin Routes (Admin Users Only)

- `/admin/dashboard` - Admin panel for case management

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the frontend directory:

   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

## Running the Application

### Development

```bash
npm start
```

The application will start on `http://localhost:3000` and automatically open in your browser.

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

### Testing

```bash
npm test
```

Runs the test suite in interactive watch mode.

## Key Components

### Authentication

- **Login Component**: Handles user authentication with form validation
- **Register Component**: User registration with profile photo upload
- **Protected Routes**: Ensures only authenticated users can access certain pages

### Case Management

- **Case Register**: Form for creating new legal cases with file upload
- **Dashboard**: User's personal case overview
- **Admin Dashboard**: Administrative interface for managing all cases

### Utilities

- **API Library**: Centralized API calls with Axios interceptors
- **Auth Library**: JWT token management and authentication helpers

## Styling

The application uses Tailwind CSS for styling with:

- **Responsive Design**: Mobile-first approach
- **Component Classes**: Utility-first CSS framework
- **Custom Configuration**: Tailored color palette and spacing
- **PostCSS**: For processing Tailwind directives

## State Management

- **React Hooks**: useState, useEffect for local state
- **Context API**: For global state management (authentication)
- **React Hook Form**: For form state and validation
- **Cookie Storage**: For persistent authentication tokens

## API Integration

The frontend communicates with the backend API through:

- **Axios**: HTTP client with interceptors for token management
- **Base URL Configuration**: Centralized API endpoint configuration
- **Error Handling**: Global error handling for API responses
- **File Upload**: Support for multipart form data

## Authentication Flow

1. User logs in through `/auth/login`
2. JWT token is stored in cookies
3. Token is included in API requests via Axios interceptors
4. Protected routes check for valid authentication
5. Admin routes additionally check for admin role

## Development Guidelines

- **Component Structure**: Functional components with hooks
- **File Organization**: Feature-based folder structure
- **Code Style**: ESLint configuration for consistent code style
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Browser Support

The application supports all modern browsers as defined in the browserslist configuration:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
