import { NextFunction,  Request,Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../mongodb/user";
import { prisma } from "..";
export interface reqAdmin extends Request{
    admin?: any
    sql?:any
}
const adminmiddleware=(req:reqAdmin,res:Response,next:NextFunction)=>{
    try{
const token= req.get('authorization')?.split(' ')[1];
 jwt.verify(token??'','Admin',async(err:any,decoded:any)=>{
    if(err){
        return res.status(401).json({error:'unauthorized'})
    }

    if(!decoded){
        return res.status(401).json({error:'unauthorized'})
    }
    req.admin=await User.findOne({email:decoded.email})
    req.sql = await prisma.user.findUnique({
        where:{
            email:decoded.email
        }
    })
    next();
})
    }catch(err){
        return res.status(500).json({error:'internal server error in the user middleware'})
    }
}
export {adminmiddleware};
