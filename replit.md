# FounderOS - AI-Powered Startup Platform

## Overview
FounderOS is a comprehensive AI-powered platform for non-technical entrepreneurs to build, validate, and scale startups. The application provides tools for idea validation, MVP generation, pitch deck creation, and startup management.

## Recent Changes
- September 24, 2025: Initial GitHub import setup for Replit environment

## Project Architecture
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Backend**: Supabase (authentication, database)
- **UI Components**: Radix UI primitives
- **Analytics**: Vercel Analytics
- **Fonts**: Geist Sans & Mono

## Key Features
1. Idea Validation Engine - AI-powered market research and competitor analysis
2. No-Code MVP Generator - Build prototypes without coding
3. Legal & Finance Auto-Setup - Automated business registration and compliance
4. Go-to-Market Playbooks - Customized marketing strategies
5. Investor-Ready Deck Builder - AI-generated pitch decks
6. Founder Network Matching - Connect with co-founders and mentors

## Database Schema
The project includes SQL scripts for:
- Users and profiles management
- Startup ideas tracking
- MVP projects
- Pitch decks
- Founder network
- Legal documents

## Current Setup Status
- [x] Dependencies installed and packages configured
- [x] LSP errors resolved 
- [x] Development server running on port 5000
- [x] Next.js configured for Replit environment (cache control, host headers)
- [x] Deployment configured for autoscale
- [x] DATABASE_URL environment variable provided
- [ ] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY needed for full functionality

## Supabase Setup Required
To enable authentication and full functionality, you need to provide:
1. NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL
2. NEXT_PUBLIC_SUPABASE_ANON_KEY - Your Supabase anon/public key

These can be found in your Supabase dashboard at:
Settings > API > Project URL and Project API keys

## Development Notes
- Uses Next.js App Router
- Requires Supabase environment variables
- Dark theme enabled by default
- TypeScript strict mode enabled