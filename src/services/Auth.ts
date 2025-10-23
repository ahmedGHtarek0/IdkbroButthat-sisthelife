import { client } from "..";
import { User } from "../mongodb/user";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
interface user{
    name?: string
    email?: string
    password?: string
    role?: 'admin' | 'user'
    phone?: string;
}
const generateOTP = (): string => {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); 
  }
  return otp;
};
const sendemail= async({email}:user)=>{
    const checktheuser= await User.findOne({email});
    if(checktheuser){
        return {data:'user already exists',status:400}
    }
     try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "3211ahaaaaa321@gmail.com",
        pass: "bgrh erhu urap dmjg",
      },
    });
     const otp = generateOTP();
    const info = await transporter.sendMail({
      from: 'ahmed tarek to anyone bro my  email 3211ahaaaaa321@gmail.com',
      to: `${email}`,
      subject: "Hello ✔",
      text: "Hello world!",
      html:`<b>Ur otp is ${otp}</b>`,
    });
    await client.set(otp,otp,{EX:300});
    console.log("✅ Email sent:", info.messageId);
return {data:'check ur email',status:200}
  } catch (error) {
    console.log("❌ Email sending failed:", error);
    return {data:'Failed to send email',status:500}
  }
  
    
}
const savetheuser= async({name,email,password}:user,otp:string)=>{
  try{
  const checktheotp= await client.get(otp)
  if(!checktheotp){
    return {data:'invalid otp or expired',refreshtoken:'there is now data2',status:400}
  }
  const newuser= await User.create({name,email,password,role:'user'})
  const accesstoken= makeaccesstokenForUser({email})
  const refreshtoken= makerefreshtokenforUser({email})
  await client.del(otp)
  await client.set(refreshtoken,refreshtoken,{EX:7*24*60*60})
  return {data:accesstoken,refreshtoken,status:201}
}catch(err){
  return {data:'internal server error',refreshtoken:'there is error here code  ',status:500}

}
}

const saveAdmin= async({name,email,password}:user,otp:string)=>{
  try{
  const checktheotp= await client.get(otp)
  if(!checktheotp){
    return {data:'invalid otp or expired',refreshtoken:'no data2 here ',status:400}
  }
  const newuser= await User.create({name,email,password,role:'admin'})
  const accesstoken= makeaccesstokenForAdmin({email})
  const refreshtoken= makerefreshtokenforAdmin({email})
  await client.del(otp)
  await client.set(refreshtoken,refreshtoken,{EX:7*24*60*60})
  return {data:accesstoken,refreshtoken,status:201}
}catch(err){
  return {data:'internal server error',refreshtoken:'error in  code here',status:500}

}
}
const makeaccesstokenForUser=(data:any)=>{

  return jwt.sign(data, process.env.user!,{expiresIn:'1h'})
}
const makerefreshtokenforUser=(data:any)=>{

  return jwt.sign(data, process.env.user!,{expiresIn:'7d'})
}
const makeaccesstokenForAdmin=(data:any)=>{

  return jwt.sign(data, process.env.Admin!,{expiresIn:'1h'})
}
const makerefreshtokenforAdmin=(data:any)=>{

  return jwt.sign(data, process.env.Admin!,{expiresIn:'7d'})
}
const loginfunction= async({email,password}:user)=>{
  try{
  const checktheuser= await User.findOne({email})
  if(!checktheuser){
    return {data:'user not found',status:404}
  } 
  if(!password){
    return {data:'password is required',status:400}
  }
  const passwordMatch= await bcrypt.compare(password,checktheuser.password);
  if(!passwordMatch){
    return {data:'invalid password',status:400}
  } 
  if(checktheuser.role==='user' ){
    const accesstoken= makeaccesstokenForUser({email})
    const refreshtoken= makerefreshtokenforUser({email})
    await client.set(refreshtoken,refreshtoken,{EX:7*24*60*60})
    return {data:accesstoken,refreshtoken,status:200}
  }
  else{
    const accesstoken= makeaccesstokenForAdmin({email})
    const refreshtoken= makerefreshtokenforAdmin({email})
    await client.set(refreshtoken,refreshtoken,{EX:7*24*60*60})
    return {data:accesstoken,refreshtoken,status:200}
  }
}catch(err){
  return {data:'internal server error',refreshtoken:'error here ',status:500}
}
}

export {sendemail,savetheuser,loginfunction,saveAdmin};