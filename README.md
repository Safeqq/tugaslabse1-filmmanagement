# Film Management System

Sistem manajemen film dengan fitur review, rating, dan daftar tontonan pribadi.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Hook Form + Zod
- Axios

## Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local sesuai backend API URL

# Run development
pnpm dev

# Build production
pnpm build
pnpm start
```

## Features

### Public
- Browse film catalog (pagination & search)
- View film details & reviews
- View genres
- View user profiles

### User (Login Required)
- Register & Login
- Write reviews (rating 1-10)
- React to reviews (like/dislike)
- Add films to lists (watching/completed/plan_to_watch)
- Toggle list visibility (public/private)

### Admin
- Manage genres (CRUD)
- Add films with multiple images & genres

## API Configuration

Backend API: `http://localhost:3001/api/v1`

Update di `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Test Account

Admin:
```
Email: atmin@email.com
Password: myatmin123
```

## Project Structure

```
film-management/
├── app/              # Pages (Next.js App Router)
│   ├── admin/       # Admin pages
│   ├── films/       # Film catalog & detail
│   ├── genres/      # Genre listing
│   ├── login/       # Login page
│   ├── register/    # Register page
│   ├── my-lists/    # User's film lists
│   └── users/       # User profiles
├── components/      # Reusable components
├── hooks/          # Custom hooks
├── lib/            # Core utilities & types
└── public/         # Static assets
```

## Key Features Implementation

- JWT Authentication with auto token injection
- Role-based Access Control (USER/ADMIN)
- Protected routes
- Form validation with Zod
- Debounced search (500ms)
- Pagination (10-20 items per page)
- Multiple image upload (FormData)
- Responsive design
- Loading & error states

