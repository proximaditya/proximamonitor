# 🐳 ProximaMonitor

**A self-hosted, lightweight API & Website Health Dashboard with Tech Stack Detection.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge)](https://proximaditya-project.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-1B222D?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

*Experience the live project here: [https://proximaditya-project.vercel.app/](https://proximaditya-project.vercel.app/)*

---

## 🎥 Project Demo

*(Demo GIF coming soon...)*
<!-- Replace the line below with your actual gif once you record it -->
<!-- ![ProximaMonitor Demo](./demo.gif) -->

---

## 📖 The Vision & Practical Use Cases

**The Problem:** Standard monitoring tools (like Datadog or UptimeRobot) are incredibly powerful, but they are often bloated and overkill for simple projects. Sometimes, you just want to know: *Is my API alive? How fast is it? And what is hosting it?*

**The Solution:** ProximaMonitor is a streamlined, serverless-ready dashboard designed for quick insights without the enterprise overhead. 

### Ideal Use Cases:
- **Server Benchmarking:** Add your own website alongside Google, YouTube, and Apple to see how your server latency compares to tech giants.
- **API Health Checks:** Keep track of third-party API endpoints you rely on for your own apps.
- **Tech Stack Recon:** Discover what hosting providers (Cloudflare, Vercel, AWS, Nginx) your favorite websites are using under the hood.

---

## ✨ Core Features (What makes it unique?)

1. **Hidden Tech Stack Detector 💻:** The custom ping engine doesn't just measure speed; it intercepts the HTTP `Server` headers from the target URL to reveal the hidden technology hosting the website.
2. **Interactive Live Mode ⏱️:** Instead of just static checks, users can toggle "Live Mode" which triggers a background engine to ping all websites every 30 seconds for 10 minutes, updating the UI dynamically.
3. **Dynamic Leaderboard & Ranking 🏆:** Websites are automatically ranked based on latency. The top 3 sites receive Gold, Silver, and Bronze UI treatments, and a slide-out drawer provides a ranked leaderboard.
4. **Historical Sparkline Charts 📊:** Every card features a dynamic mini bar chart visualizing the last 10 ping responses, making it easy to spot latency spikes or intermittent 500-errors.
5. **Anti-Spam Security 🛡️:** Built-in rate limiting directly at the database level. To protect the API, it rejects requests if more than 10 websites are added within a 60-minute window.

---

## 🧠 The Build Experience & Journey

**Project Difficulty:** `Moderate`

This project goes beyond a standard "To-Do app". Building it required handling the complexities of full-stack Next.js architecture, CI/CD pipelines, and database state management. 

**Key Challenges Overcome:**
- **The Serverless Database Shift:** The project was initially built using a local SQLite file (`dev.db`). However, deploying to Vercel's serverless edge meant local files would be wiped on every request. I had to migrate the entire schema to a **Neon PostgreSQL Cloud Database** to make it production-ready.
- **TypeScript Strictness in CI/CD:** During deployment, Vercel's strict build process crashed because it couldn't guarantee that `process.env.DATABASE_URL` was a string. This required explicit type assertions in the Prisma config to satisfy the compiler.
- **Prisma Type Caching Bugs:** Adding the `serverType` column introduced caching bugs where the build pipeline and VS Code threw false errors. I resolved this by modifying the `package.json` build script to explicitly force `prisma generate && next build` in the deployment pipeline.
- **Zombie Processes:** Fighting Windows `EPERM` (Permission Denied) errors when Prisma locked database files, requiring raw `taskkill` terminal commands to free up the Node execution environment.

---

## ⚠️ Important Note on `dev.db`

If you explore the repository, you will see a `dev.db` file. This is purely a historical artifact from the early SQLite development phase. The current `prisma/schema.prisma` is strictly configured for **PostgreSQL**. If you clone this to run locally, you must connect it to a Postgres provider via your `.env` file.

---

## 🛠️ Local Setup Instructions
Want to run ProximaMonitor on your own machine? Follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/proximaditya/proximamonitor.git
cd proximamonitor
```
## 2. Install Dependencies

```bash
npm install
```

## 3. Configure the Database

Create a `.env` file in the root directory. You need a PostgreSQL connection string (I highly recommend Neon.tech for a free serverless Postgres DB).

```env
DATABASE_URL="postgresql://your_username:your_password@your_neon_host.aws.neon.tech/neondb?sslmode=require"
```

## 4. Initialize Prisma

Sync your database schema and generate the Prisma client:

```bash
npx prisma db push
npx prisma generate
```

## 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You can now add websites, detect their tech stacks, and start monitoring!

---

## 📄 License

This project is open-source and licensed under the MIT License. Feel free to clone, modify, and learn from the architecture.

Architected and built with ❤️ by Aditya.
