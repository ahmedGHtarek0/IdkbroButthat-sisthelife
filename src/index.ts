import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary';
import Auth from './routes/Auth';
import cruduser from './routes/cruduser';
import { Category } from './mongodb/catgory';

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME ??'',
  api_key: process.env.CLOUD_API_KEY ??'',
  api_secret: process.env.CLOUD_API_SECRET ?? '',
});
export default cloudinary
const app = express();
export const prisma = new PrismaClient();
const port = process.env.PORT || 5000;
const mongoUrl = process.env.Data_Base_Url ?? 'typescript Error';

// ✅ CONNECT PRISMA FIRST
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect Prisma:", error);
  }
})();

// ✅ CONNECT MONGODB
mongoose
  .connect(mongoUrl)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// ✅ CONNECT REDIS
export const client = createClient({
  username: 'default',
  password: process.env.passwordredis || '',
  socket: {
    host: process.env.Redis || '',
    port: 18355
  }
});

(async () => {
  try {
    client.on("error", (err) => console.log("❌ Redis Client Error:", err));
    await client.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect Redis:", error);
  }
})();

// ✅ MIDDLEWARE
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// ✅ ROUTES
app.use('/auth', Auth);
app.use('/user',cruduser)
// ✅ START SERVER
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
