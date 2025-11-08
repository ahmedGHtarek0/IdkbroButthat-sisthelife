// controllers/uploadController.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";


// 🔹 إعداد Cloudina
// 🔹 إعداد تخزين Cloudinary مع Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req:any, file:any) => {
    return {
      folder: "twiceandjust5inTheSametime", // ← اسم الفولدر في Cloudinary
      public_id:
        new Date().toISOString().replace(/:/g, "-") +
        "-" +
        file.originalname.split(" ").join("_"), // ← اسم مميز لكل ملف
      resource_type: "auto", // ← يخلي Cloudinary يكتشف النوع (صورة / فيديو)
    };
  },
});

// 🔹 فلتر للأنواع المسموح بها (اختياري)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only image or video files are allowed"), false);
  }
};

// 🔹 إنشاء Middleware واحد
export const uploadMultipleMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // حد أقصى 10 ميجا لكل ملف
});

