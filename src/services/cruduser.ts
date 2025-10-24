import mongoose from "mongoose";
import { promises } from "nodemailer/lib/xoauth2";
import { User } from "../mongodb/user";
import { prisma } from "..";
import { ProfileImage } from "../mongodb/profileimage";

interface smallpic{
    SmallimageUrl: string;
    userId:any;
}
interface bigpic{
    BigimageUrl: string;
    userId:any;
}
type returntype={
    data:string,
    status:number
}
const addorupdatesmallphoto=async({userId,SmallimageUrl}:smallpic):Promise<returntype>=>{
    try{
    const searchabouuser= await ProfileImage.findOne({userId});
    if(searchabouuser){
        const addimage= await ProfileImage.updateOne({userId:userId},{
            $set:{
                SmallimageUrl:SmallimageUrl
            }
        },{upsert:true});
        return {data:'small image added or updated successfully',status:200};
    }
    const addnewuser= await ProfileImage.create({SmallimageUrl:SmallimageUrl,userId:userId})
    await addnewuser.save()
    return {data:'add new pic for user',status:400};
}catch(err){
    return {data:'internal server error',status:500};
}

return {data:'internal server error',status:500};
}
const  addBigPic=async({userId,BigimageUrl}:bigpic):Promise<returntype>=>{
    try{
    const searchabouuser= await ProfileImage.findOne({userId});
    if(searchabouuser){
        const addimage= await ProfileImage.updateOne({userId:userId},{
            $set:{
                    BigimageUrl:BigimageUrl
            }
        },{upsert:true});
        return {data:'big image added or updated successfully',status:200};
    }
  if(!searchabouuser){
    const addnewuser= await ProfileImage.create({BigimageUrl:BigimageUrl,userId})
    await addnewuser.save()

    return {data:'add new pic for user',status:400};
  }
}catch(err){
    return {data:'internal server error',status:500};
}

return {data:'internal server error',status:500};
}
enum nums{
    SMALL=0,
    BIG=1
}
interface deletepic{
    num:nums,
    userId:any

}
const deletephotos=async({num,userId}:deletepic)=>{
    const searchabouuser= await ProfileImage.findOne({userId})
    if(!userId){
        return {data:'there is no user to delete',status:501}
    }
    if(num===nums.SMALL){
        const deletesmallpic= await ProfileImage.findOneAndUpdate({
            userId
        },{$set:{SmallimageUrl:''}},{upsert:true})
        return {data:'deleted small photo',status:201}

    }
    else{
         const deletebigimage= await ProfileImage.findOneAndUpdate({
            userId
        },{$set:{BigimageUrl:''}},{upsert:true})
        return {data:'deleted big photo',status:201}

    }
}
export {addorupdatesmallphoto,addBigPic,deletephotos};
