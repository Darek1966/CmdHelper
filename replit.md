# Overview

This is a full-stack web application built as a command search tool that allows users to search and browse technical commands. The application features a React frontend with a modern UI built using shadcn/ui components, and an Express.js backend with PostgreSQL database integration using Drizzle ORM. The system is designed to help users quickly find and reference various technical commands with detailed information including syntax, descriptions, categories, and examples.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark mode)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development Tools**: TSX for development server with hot reload

## Data Storage
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Connection**: Connection pooling with WebSocket support for serverless environments

## Authentication & Authorization
- **Current State**: Basic user schema exists but authentication is not implemented
- **Session Management**: connect-pg-simple package included for PostgreSQL session storage
- **Future Implementation**: Ready for session-based authentication with PostgreSQL backend

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Connection**: Uses @neondatabase/serverless driver with connection pooling

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

### Development & Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema validation
- **Date-fns**: Date manipulation and formatting utilities

### Development Environment
- **Replit Integration**: Special handling for Replit development environment
- **Runtime Error Overlay**: Development error handling and display
- **Cartographer**: Development tooling for Replit environment