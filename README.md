<<<<<<< HEAD
# CmdHelper
=======
# Overview

This is a professional full-stack web application designed for searching and exploring Windows CMD commands in Polish. The application connects to a user's Neon PostgreSQL database containing a comprehensive collection of 50 CMD commands. It features a modern React frontend with shadcn/ui components, professional styling with light/dark themes, and full functionality including command copying. The system displays commands from the `polecenia_cmd` table with fields: polecenie (command), opis_krotki (short description), opis_szczegolowy (detailed description), and slowa_kluczowe (keywords array).

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
- **Database**: User's Neon PostgreSQL database (postgresql://neondb_owner:npg_LZhn7Kl8ASPF@ep-weathered-recipe-a28prumt-pooler.eu-central-1.aws.neon.tech/neondb)
- **Primary Table**: `polecenia_cmd` with 50 Windows CMD commands
- **Schema**: id (integer), opis_krotki (text), polecenie (text), opis_szczegolowy (text), slowa_kluczowe (text array)
- **ORM**: Drizzle ORM adapted to match existing database structure
- **Connection**: Direct connection to user's Neon database with WebSocket support

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
>>>>>>> 5919c3d (Initial commit)
