# 🚀 IdkbroButthat-sisthelife

![Project Banner](https://raw.githubusercontent.com/ahmedGHtarek0/IdkbroButthat-sisthelife/main/assets/banner.png)

A professional-grade, high-performance Node.js backend system built with **TypeScript**, **Express**, and **Prisma**. This project serves as a robust foundation for modern web applications, featuring advanced authentication, cloud storage integration, and scalable architecture.

## ✨ Key Features

- **🛡️ Secure Authentication**: JWT-based login/signup with Bcrypt password hashing.
- **🌐 Google OAuth 2.0**: Integrated social login using Passport.js.
- **🗄️ Database Excellence**: Type-safe database operations with Prisma ORM and MongoDB.
- **⚡ Performance Caching**: Redis integration for high-speed data retrieval and session management.
- **☁️ Cloud Media Management**: Seamless image/file uploads via Cloudinary and Multer.
- **📧 Email Services**: Automated email notifications using Nodemailer.
- **⏰ Scheduled Tasks**: Cron jobs for background processing.
- **✅ Data Validation**: Schema-based request validation with Zod.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Caching**: [Redis](https://redis.io/)
- **Storage**: [Cloudinary](https://cloudinary.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Instance
- Redis Server
- Cloudinary Account (for uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ahmedGHtarek0/IdkbroButthat-sisthelife.git
   cd IdkbroButthat-sisthelife
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL="your_mongodb_url"
   REDIS_URL="your_redis_url"
   JWT_SECRET="your_secret"
   CLOUDINARY_CLOUD_NAME="your_name"
   CLOUDINARY_API_KEY="your_key"
   CLOUDINARY_API_SECRET="your_secret"
   GOOGLE_CLIENT_ID="your_id"
   GOOGLE_CLIENT_SECRET="your_secret"
   ```

4. **Setup Prisma:**
   ```bash
   npx prisma generate
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📖 Documentation

For a deeper dive into the architecture, design patterns, and advanced configurations, please refer to the [Advanced README](./README_ADVANCED.md).

---
Created with ❤️ by [ahmedGHtarek0](https://github.com/ahmedGHtarek0)
