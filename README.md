# LeetInsight

LeetInsight is a premium, AI-powered coding analytics dashboard designed to help developers track their LeetCode preparation, visualize solved datasets, schedule algorithmic studies, and utilize Gemini models for smart code diagnostics.

## Features

- **LeetCode Profile Integration**: Synced via public GraphQL API, backed by MongoDB cache schemas (24-hour expiration cycle).
- **Gamified Daily Goals Checklist**: Rewards XP on completions, levels up profiles (Lvl 1 -> 2 -> 3), maintains streak tracking, and unlocks achievement badges.
- **Solve Contribution Heatmap**: GitHub-style activity grid supporting Month and Year filters, and hover tooltips.
- **Revision Planner**: Diagnostic note repository detailing approach algorithms, time/space complexity tags, common bug logs, search indexing, bookmarks, and favorite lists.
- **Gemini AI Coaching Console**: Diagnoses stats, pinpoints weakness tags, outputs study curricula schedules, and forecasts contest rating curves.
- **GitHub Sync profile**: Connect dashboard pages to public repositories, tracking languages distribution, commit feeds, stars, forks, and contribution calendars.
- **Custom Error boundaries**: Glowing dark-mode 404 & 500 error pages.

---

## Technology Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI & Styling**: React 19, Tailwind CSS, Framer Motion, Lucide Icons, Shadcn-like glassmorphic styles
- **Database**: MongoDB (Mongoose connection cache mapping)
- **Charts Engine**: Recharts (dark-mode responsive containers)
- **AI Engine**: Gemini Generative API (`gemini-2.5-flash` model)

---

## Installation & Setup

### 1. Prerequisites
- [Node.js v18+](https://nodejs.org/)
- [MongoDB Server](https://www.mongodb.com/) (locally or Atlas connection string URL)

### 2. Environment Variables Configuration
Create a `.env.local` file in the root directory:
```bash
# Firebase config variables (if integrating Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id

# MongoDB database connection string URL
MONGODB_URI=mongodb://localhost:27017/leetinsight

# Gemini models API connection key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Bootstrap & Run Local Development
```bash
# Clone the repository
git clone https://github.com/gupta-codes/LeetInsight.git
cd LeetInsight

# Install project dependencies
npm install

# Run application on dev servers (http://localhost:3000)
npm run dev
```

### 4. Build Production Distribution
```bash
npm run build
npm run start
```

---

## Docker Container Deployments
You can bootstrap LeetInsight using Docker and Docker Compose containers:

```bash
# Boot containers (Next.js app + Mongo instances)
docker-compose up --build
```
The app mounts on port **3000** and connects to the container database cache.

---

## Production Deployment Targets

### 1. Frontend: Vercel
- Connect the Git repository to your [Vercel Console](https://vercel.com).
- Set Environment Variables:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `MONGODB_URI` (use MongoDB Atlas URL string)
  - `GEMINI_API_KEY`
- Vercel automatically deploys the frontend routes.

### 2. Database: MongoDB Atlas
- Provision a free database cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Whitelist deployment IPs (or use `0.0.0.0/0` for serverless route handlers).
- Copy the Connection URI connection string into Vercel and Docker env sheets.
