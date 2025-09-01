# Overview

This is a full-stack task management application built with a React frontend and Express.js backend. The application provides a Kanban-style board for organizing and tracking tasks across different status columns (Pending, In Progress, Analysis/Approval, Paused, Completed). It features a modern UI built with shadcn/ui components and Radix UI primitives, styled with Tailwind CSS.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation integration

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API design with CRUD operations for tasks and teams
- **Data Validation**: Zod schemas for request validation
- **Storage Interface**: Abstract storage interface with in-memory implementation for development
- **Error Handling**: Centralized error middleware with structured error responses

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but currently using in-memory storage for development)
- **Schema**: Type-safe database schemas with Drizzle and Zod integration
- **Migrations**: Drizzle Kit for database migrations

## Key Design Patterns
- **Monorepo Structure**: Shared schemas and types between client and server in `/shared` directory
- **Component Architecture**: Modular UI components with clear separation of concerns
- **API Layer**: Centralized API request handling with error management
- **Type Safety**: Full TypeScript integration across frontend, backend, and shared code

## Development Environment
- **Hot Reload**: Vite HMR for frontend development
- **Development Server**: Express server with request logging and error handling
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)
- **Code Quality**: TypeScript strict mode with comprehensive type checking

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for production database connectivity
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional className utility

## Development Tools
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution environment for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

## Form and Validation
- **react-hook-form**: Performant forms library
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation

## Utilities
- **date-fns**: Date manipulation and formatting
- **wouter**: Minimalist routing library
- **nanoid**: URL-safe unique ID generator
- **cmdk**: Command palette component