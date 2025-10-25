import mongoose from "mongoose";
import { promises } from "nodemailer/lib/xoauth2";
import { User } from "../mongodb/user";
import { prisma } from "..";
import { ProfileImage } from "../mongodb/profileimage";
import { permission } from "node:process";


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
export {addorupdatesmallphoto,addBigPic,deletephotos};
