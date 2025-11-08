import cloudinary from "..";


export const uploadSingleImage = async (req:any, res:any) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'يجب رفع صورة واحدة فقط' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image", // صور فقط
      folder: "onephoto",     // اسم الفولدر في Cloudinary
    });

    res.json({
      message: 'تم رفع الصورة بنجاح ✅',
      image: {
        url: result.secure_url,
        public_id: result.public_id,
        folder: result.folder
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء رفع الصورة', error });
  }
};
