# ProximaMonitor

**A self-hosted, real-time API and Website Health Dashboard.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge)](https://proximaditya-project.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-1B222D?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*Experience the live project here: [https://proximaditya-project.vercel.app/](https://proximaditya-project.vercel.app/)*

---

## 🎥 Project Demo

*(Demo GIF coming soon...)*
<!-- Replace the line below with your actual gif once you record it -->
<!-- ![ProximaMonitor Demo](./demo.gif) -->

---

## 📖 The Vision & Goal

### The Problem
Developers, indie hackers, and small businesses rely heavily on web applications and external APIs. When a service goes down, you need to know immediately. However, industry-standard monitoring tools (like Datadog, UptimeRobot, or New Relic) are often bloated, expensive, and overly complex for simple use cases. 

### The Solution: ProximaMonitor
ProximaMonitor was built to bridge this gap. It is a lightweight, self-hosted, full-stack monitoring dashboard that allows users to independently track the uptime and latency of their favorite websites and critical API endpoints. 

### Core Agenda
1. **Simplicity:** Provide a clean, distraction-free UI indicating `UP` or `DOWN` statuses at a glance.
2. **Speed:** Measure response latency (in milliseconds) to detect degraded performance before a full outage occurs.
3. **Full CRUD Control:** Empower the user to easily Add, Read, Update (Ping), and Delete tracking monitors directly from the UI without touching the database.

---

## ✨ Key Features

- **Real-Time Ping Engine:** A custom-built backend engine that fetches target URLs and calculates exact response times.
- **Dynamic Status Badges:** Visual indicators that instantly highlight if a service is healthy (Green/UP) or failing (Red/DOWN).
- **Interactive UI:** Users can trigger manual health checks across all monitors with a single click.
- **Serverless Ready:** Fully optimized to be deployed on Vercel's serverless edge architecture.
- **Responsive Design:** Beautifully styled with Tailwind CSS to work flawlessly on both desktop and mobile.

---

## ⚠️ Important Database Note (SQLite vs Neon PostgreSQL)

If you explore the source code of this repository, you may notice a `dev.db` file. 

During early local development, this project was bootstrapped using a local **SQLite** database (`dev.db`). However, SQLite is not compatible with Serverless deployment platforms like Vercel (because serverless environments wipe local files after every execution).

To make this project production-ready, the database architecture was migrated to **Neon DB (PostgreSQL)**. 

**If you are cloning this repository:**
The current `prisma/schema.prisma` is configured for **PostgreSQL**. To run this locally, you must create a free Neon database and connect it via your `.env` file (see instructions below). The `dev.db` file remains in the repo purely as a historical artifact of the development process.

---

## 🛠️ Getting Started (Local Setup)

Want to run ProximaMonitor on your own machine? Follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/proximaditya/proximamonitor.git
cd proximamonitor
### 2. Install Dependencies
```bash
npm install
```

### 3. Configure the Database
Create a `.env` file in the root directory. You will need a PostgreSQL connection string (I highly recommend Neon.tech for a free serverless Postgres DB).
```env
DATABASE_URL="postgresql://your_username:your_password@your_neon_host.aws.neon.tech/neondb?sslmode=require"
```

### 4. Initialize Prisma
Sync your database schema and generate the Prisma client:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser. You can now add websites and start tracking their health!

---

## 🧠 Tech Stack Deep Dive
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes (Serverless Functions)
- **Database:** PostgreSQL (Hosted on Neon)
- **ORM:** Prisma Client
- **Deployment:** Vercel (CI/CD connected directly to Git)

---

## 🔮 Future Enhancements
While ProximaMonitor is fully functional, I plan to add the following features in the future:
- **Automated Cron Jobs:** Automatically trigger the ping engine every 5 minutes in the background.
- **Historical Charts:** Implement Recharts to visualize uptime and latency over a 24-hour period.
- **Alerting System:** Send an automated email or Discord webhook when a service goes down.

---

## 📄 License
This project is open-source and licensed under the **MIT License**. Feel free to use it, modify it, and learn from it!

*Built with ❤️ by Aditya.*
