import mongoose, { Types } from "mongoose";
import { promises } from "nodemailer/lib/xoauth2";
import { User } from "../mongodb/user";
import { prisma } from "..";
import { ProfileImage } from "../mongodb/profileimage";
import { permission } from "node:process";
import { Type } from "typescript";
import { Category } from "../mongodb/catgory";
import { Post } from "../mongodb/post";



interface smallpic{
    SmallimageUrl: string;
    userId:any;
    userid:any
}
interface bigpic{
    BigimageUrl: string;
    userId:any;
    userid:any
}
type returntype={
    data:string,
    status:number
}
const addorupdatesmallphoto=async({userId,SmallimageUrl,userid}:smallpic):Promise<returntype>=>{
    try{
    const searchabouuser= await ProfileImage.findOne({userId});
    const searchabouuserSql= await prisma.image.findUnique({
        where:{
            userId:userid
        }
    })
    if(searchabouuser && searchabouuserSql){
        const addimage= await ProfileImage.updateOne({userId:userId},{
            $set:{
                SmallimageUrl:SmallimageUrl
            }
        },{upsert:true});
        const updateinsql= await prisma.image.update({
            where:{
                userId:userid
            },
            data:{
                SmallimageUrl
            }
        })
        return {data:'small image added or updated successfully',status:200};
    }
    else{
    const addnewuser= await ProfileImage.create({SmallimageUrl:SmallimageUrl,userId:userId})
    await addnewuser.save()
    const addnewinsql= await prisma.image.create({data:{
        userId:userid,
        SmallimageUrl
    }})
    return {data:'add new pic for user',status:400};
}
}catch(err){
    return {data:'any  '+err,status:500};
}
}
const  addBigPic=async({userId,BigimageUrl,userid}:bigpic):Promise<returntype>=>{
    try{
    const searchabouuser= await ProfileImage.findOne({userId});
    const searchabouuserSql = await prisma.image.findUnique({
        where:{
            userId:userid
        }
    })
    if(searchabouuser && searchabouuserSql){
        const updateinsql= await prisma.image.update({
            where:{
                userId:userid
            },
            data:{
                BigimageUrl
            }
        })
        const addimage= await ProfileImage.updateOne({userId:userId},{
            $set:{
                    BigimageUrl:BigimageUrl
            }
        },{upsert:true});
        return {data:'big image added or updated successfully',status:200};
    }
    const addnewuser= await ProfileImage.create({BigimageUrl:BigimageUrl,userId})
    await addnewuser.save()
    const  addinsqltoo = await prisma.image.create({
        data:{
            userId:userid,
            BigimageUrl
        }
    })
    return {data:'add new pic for user',status:400};
  
}catch(err){
    return {data:'internal server error',status:500};
}

}
enum nums{
    SMALL=0,
    BIG=1
}
interface deletepic{
    num:nums,
    userId:any,
    userid:any

}
const deletephotos=async({num,userId,userid}:deletepic)=>{
    const searchabouuser= await ProfileImage.findOne({userId})
    const searchabouuserSql =await prisma.image.findUnique({
        where:{
            userId:userid
        }
    })
    if(!userId  &&  ! userid){
        return {data:'there is no user to delete',status:501}
    }
    if(num===nums.SMALL){
        const deletesmallpic= await ProfileImage.findOneAndUpdate({
            userId
        },{$set:{SmallimageUrl:''}},{upsert:true})
        const deletethinginsql= await prisma.image.update({
            where:{
                userId:userid
            },
            data:{
                SmallimageUrl:''
            }
        })
        return {data:'deleted small photo',status:201}
        

    }
    else{
         const deletebigimage= await ProfileImage.findOneAndUpdate({
            userId
        },{$set:{BigimageUrl:''}},{upsert:true})
        const deletethinginsql= await prisma.image.update({
            where:{
                userId:userid
            },
            data:{
                BigimageUrl:''
            }
        })
        return {data:'deleted big photo',status:201}

    }
}


interface AddPostInput {
  discreption: string;
  category: string[];
  photos: string[];
  userId: Types.ObjectId; // MongoDB user id
  sqlUserId: string; // Prisma user id (Postgres)
}

 const Addpost = async ({
  discreption,
  category,
  photos,
  userId,
  sqlUserId,
}: AddPostInput) => {
  const mongoUser = await User.findById(userId);
  if (!mongoUser) {
    return { data: "User not found in MongoDB", status: 401 };
  }

  const mongoCategories = await Category.find({name:{$in:category}});
  if (mongoCategories.length !== category.length) {
    return { data: "One or more categories not found", status: 401 };
  }

  // ✅ 3. صورة المستخدم
  const mongoProfile = await ProfileImage.findOne({ userId });

  // ✅ 4. إنشاء البوست في MongoDB
  const mongoPost = await Post.create({
    author: mongoUser.name,
    pic: mongoProfile?.SmallimageUrl,
    discreption,
    photos,
    category: mongoCategories.map((c) => c._id),
    userid:userId,
  });

  // ✅ 5. حدث كل Category بإضافة البوست الجديد
  for (const cat of mongoCategories) {
    await Category.findByIdAndUpdate(cat._id, {
      $push: { posts: mongoPost._id },
    });
  }

  // ✅ 6. تحقق من المستخدم في SQL
  const sqlUser = await prisma.user.findUnique({
    where: { id: sqlUserId },
  });

  if (!sqlUser) {
    return { data: "User not found in SQL", status: 401 };
  }

  // ✅ 7. تحقق من الفئات في SQL
  const sqlCategories = await prisma.category.findMany({
    where: { name: { in: category } },
  });

  if (sqlCategories.length !== category.length) {
    return { data: "One or more SQL categories not found", status: 401 };
  }

  // ✅ 8. تحقق من الصورة في SQL
  const sqlImage = await prisma.image.findUnique({
    where: { userId: sqlUserId },
  });

  // ✅ 9. أضف البوست إلى SQL
  const sqlPost = await prisma.post.create({
    data: {
      author: mongoUser.name,
      pic: sqlImage?.SmallimageUrl ?? "",
      discreption:discreption,
      photos,
      userid: sqlUserId,
      category: {
        connect: sqlCategories.map((c) => ({ id: c.id })),
      },
    },
  });

  // ✅ 10. رجع البيانات
  return { data: { mongoPost, sqlPost }, status: 201 };
};

/*
npx prisma migrate dev --name make_share_optional
npx prisma generate
 */
/* we will make the crud opreation of post tommowrrow*/
export {addorupdatesmallphoto,addBigPic,deletephotos,Addpost};
