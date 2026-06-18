# Journalism CMS Project Instructions

## Project Overview
This is a modern Next.js web application for online journalism content templating and visual storytelling. It provides a comprehensive CMS solution for journalists and editors to create visually appealing online articles using predefined templates.

## Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- MongoDB
- Node.js

## Project Structure
- `/app` - Next.js App Router pages and layouts
- `/components` - React components
- `/lib` - Utility functions and database connections
- `/models` - MongoDB schema definitions
- `/public` - Static assets

## Development Guidelines
- Use TypeScript for all new code
- Follow component-based architecture
- Keep components small and focused
- Use TailwindCSS for styling
- Maintain consistent error handling

## Running the Project
1. Install dependencies: `npm install`
2. Create `.env.local` from `.env.local.example`
3. Ensure MongoDB is running
4. Run development server: `npm run dev`
5. Open http://localhost:3000

## Database Setup
Ensure MongoDB is installed and running locally at `mongodb://localhost:27017`

## Building for Production
Run: `npm run build` followed by `npm start`
