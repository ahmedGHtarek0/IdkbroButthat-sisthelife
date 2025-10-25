import { NextFunction,  Request,Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../mongodb/user";
import { prisma } from "..";
export interface reqUser extends Request{
    user?: any
    sql?:any
}
const usermiddleware=(req:reqUser,res:Response,next:NextFunction)=>{
    try{
const token= req.get('authorization')?.split(' ')[1];
 jwt.verify(token??'','user',async(err:any,decoded:any)=>{
    if(err){
        return res.status(401).json({error:'unauthorized'})
    }

    if(!decoded){
        return res.status(401).json({error:'unauthorized'})
    }
    req.user=await User.findOne({email:decoded.email})
    req.sql=await prisma.user.findUnique({where:{
        email:decoded.email
    }})
    next();
})
    }catch(err){
        return res.status(500).json({error:'internal server error in the user middleware'})
    }
}
export {usermiddleware};
