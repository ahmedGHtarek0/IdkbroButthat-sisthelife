import { Router } from "express";
import { addorupdatesmallphoto, addBigPic, deletephotos } from "../services/cruduser";
import { reqUser, usermiddleware } from "../middleware/usermiddleware";
import { validateimageSchemaBig, validateimageSchemasmall } from "../mongodb/profileimage";
 

const router = Router();

router.post("/small", usermiddleware, async (req: reqUser, res) => {
  try {
    const userId = req.user._id;
    const Data = validateimageSchemasmall.safeParse(req.body);
    if (!Data.success) {
      return res.status(400).json({ message: "Invalid small image data" });
    }
    const { SmallimageUrl } = Data.data as any;
    const result = await addorupdatesmallphoto({ userId, SmallimageUrl });
    return res.status(result.status).json({ message: result.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/big", usermiddleware, async (req: reqUser, res) => {
  try {
    const userId = req.user._id;
    const Data = validateimageSchemaBig.safeParse(req.body); // استخدم schema صح
    if (!Data.success) {
      return res.status(400).json({ message: "Invalid big image data" });
    }
    const { BigimageUrl } = Data.data as any;
    const result = await addBigPic({ userId, BigimageUrl });
    return res.status(result.status).json({ message: result.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/", usermiddleware, async (req: reqUser, res) => {
  try {
    const { num } = req.body; // num = 0 or 1
    if (num === undefined || num > 1 || num < 0) {
      return res.status(400).json({ message: "num must be 0 or 1" });
    }
    const userId = req.user._id;
    const result = await deletephotos({ userId, num });
    return res.status(result.status).json({ message: result.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
/* we will  make the prisma code later inshaaalah*/
export default router;
