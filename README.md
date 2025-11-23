# FirmFlow AI

**Professional Law Firm Management System with AI-Powered Features**

FirmFlow AI is a production-ready web application designed for small to medium law firms (1-20 lawyers). Built with Next.js, PostgreSQL, and OpenRouter AI integration, it provides comprehensive case management, client intake, billing, document management, and AI-assisted legal drafting.

## Features

### Core Functionality
- **Case Management** - Full CRUD for legal cases with status tracking, practice areas, and court information
- **Client Management** - Comprehensive client profiles with intake forms and case history
- **Task Management** - Assign and track tasks across cases and team members
- **Time Tracking** - Billable hours tracking with billing rates
- **Invoicing** - Generate and track invoices with multiple status workflows
- **Document Management** - Store and organize legal documents by type and case
- **Court Filings** - Track filing deadlines, statuses, and submission history
- **Calendar** - View upcoming deadlines, hearings, and important dates
- **Secure Messaging** - Internal communication threads tied to cases

### AI-Powered Features (via OpenRouter)
- **AI Client Intake Summarizer** - Automatically summarize client intake forms and identify key legal issues
- **AI Document Drafting** - Generate legal documents, contracts, and letters with context-aware AI
- **AI Clause Generator** - Insert specific legal clauses into documents
- **AI Time Entry Helper** - Polish time entry descriptions for professional billing
- **AI Invoice Narratives** - Generate client-friendly invoice summaries
- **AI Court Filing Checklists** - Get jurisdiction-specific filing requirement checklists
- **AI KPI Insights** - Receive practice management insights from firm metrics

### Role-Based Access Control
- **ADMIN** - Full system access, user management, firm-wide analytics
- **LAWYER** - Case management, client access, document drafting
- **STAFF** - Administrative tasks, time entry, document organization
- **CLIENT** - Limited access to their own cases and documents

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Material UI (MUI v5)
- **Backend**: Next.js API Routes (Node.js + TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions
- **AI**: OpenRouter API (supports Claude, GPT, and other models)
- **Deployment**: Docker, Vercel-ready

## Prerequisites

- Node.js 18+ and Yarn
- Docker and Docker Compose (for PostgreSQL)
- OpenRouter API key ([Get one here](https://openrouter.ai/))

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd firmflow-ai
yarn install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/firmflow?schema=public"

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-YOUR-API-KEY-HERE
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# App
NODE_ENV=development
```

**Important:**
- Get your OpenRouter API key from [https://openrouter.ai/](https://openrouter.ai/)
- Generate a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`

### 3. Start PostgreSQL Database

```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5432`. Check status:

```bash
docker-compose ps
```

### 4. Set Up Database Schema and Seed Data

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

Seed the database with realistic demo data:

```bash
npx prisma db seed
```

This creates:
- 6 users (1 admin, 3 lawyers, 2 staff)
- 10 clients
- 10 cases across various practice areas
- Tasks, time entries, invoices, documents, and more

### 5. Start the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

After running the seed script, you can log in with these credentials:

| Role   | Email                          | Password    |
|--------|--------------------------------|-------------|
| Admin  | admin@firmflow.ai              | password123 |
| Lawyer | sarah.johnson@firmflow.ai      | password123 |
| Lawyer | michael.chen@firmflow.ai       | password123 |
| Lawyer | elena.rodriguez@firmflow.ai    | password123 |
| Staff  | jennifer.smith@firmflow.ai     | password123 |
| Staff  | david.brown@firmflow.ai        | password123 |

**⚠️ IMPORTANT:** Change these passwords before deploying to production!

## Project Structure

```
firmflow-ai/
├── app/                        # Next.js app directory
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth authentication
│   │   ├── ai/                 # OpenRouter AI endpoints
│   │   ├── cases/              # Case CRUD endpoints
│   │   ├── clients/            # Client CRUD endpoints
│   │   ├── tasks/              # Task CRUD endpoints
│   │   ├── time-entries/       # Time tracking endpoints
│   │   ├── invoices/           # Invoice endpoints
│   │   ├── documents/          # Document endpoints
│   │   └── court-filings/      # Court filing endpoints
│   ├── (auth)/                 # Auth-related pages (login, register)
│   ├── (dashboard)/            # Protected dashboard pages
│   │   ├── dashboard/          # Main dashboard
│   │   ├── cases/              # Cases list and detail
│   │   ├── clients/            # Clients list and detail
│   │   ├── billing/            # Time entries and invoices
│   │   ├── documents/          # Document management
│   │   ├── calendar/           # Calendar view
│   │   └── settings/           # Settings and admin
│   └── layout.tsx              # Root layout
├── components/                 # Reusable React components
│   ├── layout/                 # Layout components (AppBar, Drawer, Nav)
│   ├── cases/                  # Case-specific components
│   ├── clients/                # Client-specific components
│   └── ui/                     # Generic UI components
├── lib/                        # Utility libraries
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth configuration
│   └── openRouterClient.ts     # OpenRouter AI client
├── prisma/                     # Prisma ORM
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── public/                     # Static assets
├── .env                        # Environment variables (DO NOT COMMIT)
├── .env.example                # Example environment file
├── docker-compose.yml          # PostgreSQL Docker setup
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Database Schema

FirmFlow AI uses a comprehensive relational database schema:

### Core Entities
- **User** - System users with role-based access (Admin, Lawyer, Staff, Client)
- **Client** - Law firm clients with contact information
- **Case** - Legal matters/cases with status, practice area, court info
- **Task** - To-do items assigned to users and linked to cases
- **TimeEntry** - Billable and non-billable time tracking
- **Invoice** - Client billing with status workflow
- **Document** - Legal documents with types and AI summaries
- **IntakeForm** - Client intake questionnaires with AI analysis
- **CourtFiling** - Court filing tracking with deadlines
- **MessageThread** & **Message** - Secure internal messaging

### Practice Areas Supported
- Family Law
- Criminal Defense
- Immigration
- Business Law
- Civil Litigation
- Employment Law
- Real Estate
- Estate Planning

## AI Features & Prompts

All AI features use OpenRouter and include proper disclaimers. AI-generated content must be reviewed by attorneys before use.

### 1. AI Intake Summarizer
**Endpoint:** `POST /api/ai/intake-summary`

Analyzes client intake forms and generates:
- Concise summary for lawyer review
- List of key legal issues
- Potential information gaps

### 2. AI Document Drafting
**Endpoint:** `POST /api/ai/draft-document`

Generates legal documents based on:
- Document type (engagement letter, demand letter, contract, etc.)
- Case and client context
- User instructions (tone, jurisdiction, specific requirements)

### 3. AI Clause Generator
**Endpoint:** `POST /api/ai/insert-clause`

Creates specific legal clauses:
- Non-compete, non-disclosure, indemnification, etc.
- Jurisdiction-aware when specified
- Suitable for insertion into existing documents

### 4. AI Time Entry Helper
**Endpoint:** `POST /api/ai/time-description`

Polishes time entry descriptions:
- Converts rough notes to professional billing descriptions
- Maintains law firm style
- Client-ready language

### 5. AI Invoice Summary
**Endpoint:** `POST /api/ai/invoice-summary`

Generates invoice narratives:
- Professional cover letter text
- Summary of work performed
- Client-friendly explanations

### 6. AI Filing Checklist
**Endpoint:** `POST /api/ai/filing-checklist`

Provides court filing guidance:
- Jurisdiction-specific requirements
- Common filing checklist items
- Deadline reminders

### 7. AI KPI Insights
**Endpoint:** `POST /api/ai/kpi-insights`

Analyzes firm metrics:
- Hours billed, realization rates
- Case pipeline analysis
- Practice management suggestions

**⚠️ Legal Disclaimer:** All AI features are for drafting assistance only. They do not provide legal advice and must be reviewed by licensed attorneys.

## API Routes

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session

### Cases
- `GET /api/cases` - List all cases (with filters)
- `POST /api/cases` - Create new case
- `GET /api/cases/[id]` - Get case details
- `PUT /api/cases/[id]` - Update case
- `DELETE /api/cases/[id]` - Delete case

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/[id]` - Get client details
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

### Tasks
- `GET /api/tasks` - List tasks (filterable by case, user, status)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Time Entries
- `GET /api/time-entries` - List time entries
- `POST /api/time-entries` - Create time entry
- `PUT /api/time-entries/[id]` - Update time entry
- `DELETE /api/time-entries/[id]` - Delete time entry

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/[id]` - Get invoice details
- `PUT /api/invoices/[id]` - Update invoice status/details

### AI Endpoints
- `POST /api/ai/intake-summary` - Summarize intake form
- `POST /api/ai/draft-document` - Generate document draft
- `POST /api/ai/insert-clause` - Generate legal clause
- `POST /api/ai/time-description` - Polish time entry
- `POST /api/ai/invoice-summary` - Generate invoice narrative
- `POST /api/ai/filing-checklist` - Get filing checklist
- `POST /api/ai/kpi-insights` - Analyze firm KPIs

## Development Commands

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linter
yarn lint

# Prisma commands
npx prisma studio              # Open Prisma Studio (database GUI)
npx prisma migrate dev         # Create and apply migrations
npx prisma migrate reset       # Reset database and re-seed
npx prisma db seed             # Run seed script
npx prisma generate            # Generate Prisma Client
npx prisma format              # Format schema file

# Database commands
docker-compose up -d           # Start PostgreSQL
docker-compose down            # Stop PostgreSQL
docker-compose logs -f         # View PostgreSQL logs
```

## Deployment

### Environment Variables for Production

Ensure these are set in your production environment:

```env
DATABASE_URL=postgresql://user:password@host:port/database
OPENROUTER_API_KEY=sk-or-v1-your-production-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-secure-secret>
NODE_ENV=production
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

Vercel automatically handles Next.js builds and serverless API routes.

### Database Hosting

For production, use a managed PostgreSQL service:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)
- [Railway](https://railway.app/)

## Security Considerations

1. **Change Default Passwords** - The seed script creates default users with `password123`. Change these immediately.

2. **Secure NEXTAUTH_SECRET** - Use a strong random secret in production.

3. **Role-Based Access Control** - Implement proper authorization checks in API routes to ensure users can only access data they're permitted to see.

4. **API Key Security** - Never expose `OPENROUTER_API_KEY` to the client. Keep all AI calls server-side.

5. **Input Validation** - Validate and sanitize all user inputs to prevent injection attacks.

6. **HTTPS** - Always use HTTPS in production.

7. **Rate Limiting** - Implement rate limiting on API routes to prevent abuse.

## AI Usage & Compliance

**Important Notes:**

1. **Attorney Review Required** - All AI-generated content is for drafting purposes only and must be reviewed by licensed attorneys.

2. **No Legal Advice** - AI features do not provide legal advice and should not be relied upon without independent legal analysis.

3. **Confidentiality** - When using OpenRouter, be aware that prompts are sent to third-party AI providers. Review their data policies and consider:
   - Anonymizing sensitive client information in prompts
   - Using local/private AI models for highly sensitive matters
   - Reviewing your jurisdiction's rules on AI and client confidentiality

4. **Model Selection** - Configure `OPENROUTER_MODEL` to your preferred model:
   - `anthropic/claude-3.5-sonnet` (recommended for legal work)
   - `openai/gpt-4`
   - `meta-llama/llama-3.1-70b-instruct`
   - See [OpenRouter models](https://openrouter.ai/models) for full list

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Reset database
npx prisma migrate reset
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# If schema changes aren't reflected
rm -rf node_modules/.prisma
yarn install
```

### OpenRouter API Errors

- Verify `OPENROUTER_API_KEY` is set correctly
- Check your OpenRouter account has credits
- Ensure the selected model is available
- Review OpenRouter API status

### NextAuth Session Issues

- Clear browser cookies and local storage
- Regenerate `NEXTAUTH_SECRET`
- Check `NEXTAUTH_URL` matches your actual URL

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feature requests, please open a GitHub issue.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Material UI](https://mui.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- AI powered by [OpenRouter](https://openrouter.ai/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)

---

**Made for small law firms to manage cases, clients, and documents with AI-powered efficiency.**
