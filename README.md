# CMS Project

## Overview

A simple CMS project with a TypeScript-based Express server and a React frontend.

---

## Prerequisites

- Node.js (v16+ recommended)
- npm

---

## Clone

```bash
git clone <your-repository-url>
cd CMS
```

---

## Server (backend)

1. Change into the server directory and install dependencies:

```bash
cd server
npm install
```

2. Create a `.env` file in the `server` folder with the required variables (example below):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cms
DB_PORT=3306
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

3. Run in development (uses `ts-node-dev`):

```bash
npm run dev
```

4. Build and run for production (compile TypeScript then start):

```bash
# from server/
npx tsc
npm start
```

> The server listens on the port defined by `PORT` (defaults to 5000).

---

## Frontend (client)

1. Change into the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

2. Run the frontend in development:

```bash
npm start
```

3. Build the frontend for production:

```bash
npm run build
```

Note: The frontend's API base URL is set in `src/lib/axios.ts` (default: `http://localhost:5000/api`). Ensure the backend is running on the expected port or update that file if needed.

---

## Run locally (dev)

1. Start the server (from `server/`):

```bash
npm run dev
```

2. Start the frontend (from `frontend/`):

```bash
npm start
```

Open the frontend at http://localhost:3000 (CRA default).

---

## Additional notes

- If you want, I can add a `server/.env.example` file or a `README` section that documents the database schema and migrations.
