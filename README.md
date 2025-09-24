# FounderOS - AI-Powered Startup Platform

FounderOS is a comprehensive AI-powered platform for non-technical entrepreneurs to build, validate, and scale startups.

## Features

- **Idea Validation Engine** - AI-powered market research and competitor analysis
- **No-Code MVP Generator** - Build prototypes without coding
- **Legal & Finance Auto-Setup** - Automated business registration and compliance  
- **Go-to-Market Playbooks** - Customized marketing strategies
- **Investor-Ready Deck Builder** - AI-generated pitch decks
- **Founder Network Matching** - Connect with co-founders and mentors

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Analytics**: Vercel Analytics
- **Fonts**: Geist Sans & Mono

## Quick Deploy to Vercel

1. **Fork this repository**

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL scripts in the `/scripts` folder to set up your database
   - Get your project credentials from Settings → API

3. **Deploy to Vercel**:
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/founderos)

4. **Configure Environment Variables**:
   
   In your Vercel dashboard, add these environment variables:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=your-database-connection-string
   ```

5. **Set up Supabase Auth**:
   - In Supabase dashboard → Authentication → URL Configuration
   - Add your Vercel domain to "Site URL"
   - Add `https://your-domain.vercel.app/**` to "Redirect URLs"

## Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/founderos.git
   cd founderos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Database Setup

Run these SQL scripts in your Supabase SQL editor (in order):

1. `scripts/001_create_users_and_profiles.sql`
2. `scripts/002_create_startup_ideas.sql`
3. `scripts/003_create_mvp_projects.sql`
4. `scripts/004_create_pitch_decks.sql`
5. `scripts/005_create_founder_network.sql`
6. `scripts/006_create_legal_documents.sql`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |

## Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Shadcn/ui components
├── lib/                   # Utility libraries
│   └── supabase/         # Supabase client configuration
├── scripts/               # Database SQL scripts
├── public/               # Static assets
└── styles/               # Additional stylesheets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details