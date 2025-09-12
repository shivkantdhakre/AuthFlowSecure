# Overview

EduStream is a comprehensive online education platform that enables live interactive learning between teachers and students. The application features real-time video classes with chat functionality, content management, enrollment systems, and payment processing. Teachers can create and manage live classes, upload educational content, and track student progress, while students can browse, enroll in, and participate in live classes with interactive features like raising hands and one-on-one video calls.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with **React** using **TypeScript** and **Vite** as the build tool. The UI is styled with **Tailwind CSS** and uses **shadcn/ui** components for consistent design patterns. The application uses **Wouter** for client-side routing and **TanStack Query** for server state management. Authentication state is managed through React Context with protected routes based on user roles (student, teacher, admin).

## Backend Architecture
The server is built with **Express.js** and uses **Passport.js** with local strategy for authentication. Session management is handled through express-session with PostgreSQL session storage. The application follows a RESTful API design with role-based middleware for authorization. Real-time features are implemented using **WebSockets** for live chat and class interactions.

## Data Storage
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The database schema includes tables for users, classes, enrollments, content, messages, and ratings. **Neon Database** is used as the PostgreSQL provider for serverless deployment.

## Authentication & Authorization
Authentication is implemented using Passport.js with local strategy and **bcrypt** for password hashing. The system supports three user roles: student, teacher, and admin. Session-based authentication is used with secure HTTP-only cookies. Protected routes enforce role-based access control on both client and server sides.

## File Management
File uploads are handled using **Multer** middleware with configurable storage destinations and file size limits. The system supports multiple content types including videos, PDFs, slides, and notes for the content library functionality.

# External Dependencies

## Database & ORM
- **@neondatabase/serverless** - Serverless PostgreSQL database connection
- **drizzle-orm** - Type-safe database ORM with PostgreSQL dialect
- **connect-pg-simple** - PostgreSQL session store for express-session

## Payment Processing  
- **@stripe/stripe-js** & **@stripe/react-stripe-js** - Mock payment integration for class enrollments and course purchases

## Real-time Communication
- **ws** - WebSocket implementation for live chat and class interactions
- Built-in WebRTC placeholder for video calling functionality

## UI Components & Styling
- **@radix-ui/** components - Accessible UI primitives for all interactive elements
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** & **clsx** - Dynamic class name utilities

## Authentication & Security
- **passport** & **passport-local** - Authentication middleware and strategy
- **bcrypt** - Password hashing and validation
- **express-session** - Session management middleware

## Development Tools
- **tsx** - TypeScript execution for development server
- **esbuild** - Fast JavaScript bundler for production builds
- **@replit/vite-plugin-*** - Replit-specific development plugins for enhanced development experience