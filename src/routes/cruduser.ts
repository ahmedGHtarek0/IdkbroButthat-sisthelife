import { Router } from "express";
import { addorupdatesmallphoto, addBigPic, deletephotos, Addpost } from "../services/cruduser";
import { reqUser, usermiddleware } from "../middleware/usermiddleware";
import { validateimageSchemaBig, validateimageSchemasmall } from "../mongodb/profileimage";
import { uploadSingleImage } from "../middleware/onephoto";
import { uploadMultipleMedia } from "../middleware/vidandphoto";
import { Post, postvalidtaor } from "../mongodb/post";
import { console } from "node:inspector";
 

const router = Router();

router.post("/small", usermiddleware, uploadSingleImage, async (req: reqUser, res) => {
  try {
    const userId = req.user._id;
    const userid= req.sql.id
    console.log(req.sql.id,req.user._id)
    const Data = validateimageSchemasmall.safeParse(req.body);
    if (!Data.success) {
      return res.status(400).json({ message: "Invalid small image data" });
    }
    const { SmallimageUrl } = Data.data as any;
    const result = await addorupdatesmallphoto({ userId,userid, SmallimageUrl });
    return res.status(result.status).json({ message: result.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err });
  }
});

router.post("/big", usermiddleware,uploadSingleImage, async (req: reqUser, res) => {
  try {
    const userId = req.user._id;
    const userid= req.sql.id
    const Data = validateimageSchemaBig.safeParse(req.body); // استخدم schema صح
    if (!Data.success) {
      return res.status(400).json({ message: "Invalid big image data" });
    }
    const { BigimageUrl } = Data.data as any;
    const result = await addBigPic({ userId, userid,BigimageUrl });
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
    const userid= req.sql.id
    const result = await deletephotos({ userId,userid, num });
    return res.status(result.status).json({ message: result.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
/* we will  make the prisma code later inshaaalah*/
/* now we will add the post crud routes broooo */

router.post('/addpost',usermiddleware,uploadMultipleMedia.array('allthing',5),async(req:any,res)=>{
 try{
  console.log(req.body)
 const photos = req.files.map((file: any) => file.path);
  const userId= req.user._id
  const sqlUserId= req.sql.id
  const Data=postvalidtaor.safeParse(req.body)
  if(!Data.success){
    res.status(401).send('the data  has some thing error bro ')
  }
  const {discreption,category} = Data.data as any
  const {data,status}= await Addpost({discreption,category,photos,userId,sqlUserId})
  res.status(status).send(data)
}catch(err){
  res.send(err)
}


})
router.post('/like',usermiddleware,async(req:reqUser,res)=>{
  const userid= req.user._id
  const searchabourpost=req.query.postid
  const addorremove = Number(req.query.num)
  if(!searchabourpost ||( addorremove!=0 && addorremove !=1)){
    res.status(401).send(" we can't add like or delete it")
  }
  if(addorremove===1){
    const addlike= await Post.findOneAndUpdate({_id:searchabourpost},{$addToSet:{like:userid}})
    await addlike?.save()
    res.status(201).send('the like was added')
  }
  else{
    const addlike= await Post.findOneAndUpdate({_id:searchabourpost},{$pull:{like:userid}})
    await addlike?.save()
    res.status(201).send('the like was deleted')
  }
})

export default router;
