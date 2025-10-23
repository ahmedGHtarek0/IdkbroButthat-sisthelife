import express from 'express';
import { User, uservalidationSchema } from '../mongodb/user';
import { loginfunction, saveAdmin, savetheuser, sendemail } from '../services/Auth';
import { reqUser ,usermiddleware} from '../middleware/usermiddleware';
import  jwt  from 'jsonwebtoken';
import { client, prisma } from '..';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {OAuth2Client } from 'google-auth-library'
import { Request, Response } from 'express';
dotenv.config();
const router= express.Router();
router.post('/signupUsersAndResetPassword',async(req,res)=>{
   const Data=uservalidationSchema.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({error:' the data u send is wrong plz try again '});
    }
    const {email}=Data.data;
   const {data,status}= await sendemail({email})
   res.status(status).json({data})
})
router.post('/verifyOtpAnduser',async(req,res)=>{
    const Data= uservalidationSchema.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({error:' the data u send is wrong plz try again '});
    }
    const {name,email,password}=Data.data as any;
    const {otp}= req.body;
    otp.toString()
    const {data,refreshtoken,status}= await savetheuser({name,email,password},otp);
     res.cookie("refresh_token", refreshtoken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      // domain, path can be added if needed
    });
    res.status(status).json({data})
})
router.post('/VreufyotpforAdmin',async(req,res)=>{
    const Data= uservalidationSchema.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({error:' the data u send is wrong plz try again '});
    }
    const {name,email,password}=Data.data as any;
    const {otp}= req.body;
    otp.toString()
    const {data,refreshtoken,status}= await saveAdmin({name,email,password},otp);
      res.cookie("refresh_token",refreshtoken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      // domain, path can be added if needed
    });
    res.status(status).json({data})
})
router.post('/login',async(req,res)=>{
    try{
    const Data=uservalidationSchema.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({error:' the data u send is wrong plz try again '});
    }
    const {email,password}=Data.data;
    const {data,refreshtoken,status}= await loginfunction({email,password});
    res.cookie("refresh_token", refreshtoken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      // domain, path can be added if needed
    });
    res.status(status).json({data})
}catch(err){
    res.status(500).json({error:'internal server error'})
}
});
router.get('/refreshtoken', async (req: reqUser, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.status(401).send("no refresh token provided");

    const cachedToken = await client.get(refreshToken);
    if (!cachedToken) return res.status(401).send("refresh token expired or invalid");

    let decoded: any;
    let role: string;

    try {
      decoded = jwt.verify(cachedToken, process.env.user!);
      role = process.env.user!;
    } catch (err) {
      try {
        decoded = jwt.verify(cachedToken, process.env.Admin!);
        role = process.env.Admin!;
      } catch (err2) {
        return res.status(401).send("invalid refresh token");
      }
    }

    const newAccessToken = jwt.sign(
      { email: decoded.email },
      role,
      { expiresIn: '1h' }
    );

    return res.status(200).send(newAccessToken);

  } catch (err) {
    return res.status(500).json({ error: 'internal server error' });
  }
});

router.post('/resetpassword',async(req,res)=>{
  const Data= uservalidationSchema.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({error:' the data u send is wrong plz try again '});
    }
    const {email,password}=Data.data as any;
    const hased= await bcrypt.hash(password,10);
    const addnewpassword= await User.findOneAndUpdate({email},{$set:{password:hased}},{new:true});
    const addnewpasswordsql= await prisma.user.updateMany({
      where:{email},
      data:{password:hased}
    })
    if(!addnewpassword || addnewpasswordsql.count===0){
        return res.status(400).json({error:'user not found'})
    }
    res.status(200).json({message:'password reset successful'})
})
router.post('/otpforresetpassowrd',async(req,res)=>{
 const getotp= await client.get(req.body.otp)
  if(!getotp){
    return res.status(400).json({error:'invalid otp or expired'})
  }
  else {
    return res.status(200).json({message:'otp is valid'})
  }
})


const Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);



router.get("/google", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    // 1️⃣ لو مفيش code → نوجّه المستخدم لـ Google login
    if (!code) {
      const authUrl = Client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email"
        ],
        prompt: "consent"
      });
      return res.redirect(authUrl);
    }

    console.log("🔹 Code received, exchanging for tokens...");
    const { tokens } = await Client.getToken(code as string);
    if (!tokens.id_token) throw new Error("No ID token received");

    // 2️⃣ التحقق من ID token
    const ticket = await Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID || ""
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error("No user data received");

    console.log("🔹 Payload received:", payload);

    // 3️⃣ البحث عن المستخدم أو إنشاء جديد
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({ email: payload.email, name: payload.name ,password:"googleuser"});
      await user.save();
    }

    let userInSQL = await prisma.user.findUnique({ where: { email: payload.email! } });
    if (!userInSQL) {
      await prisma.user.create({
        data: { email: payload.email!, name: payload.name!, password: "googleuser" }
      });
    }

    // 4️⃣ إنشاء access & refresh tokens
    const accessToken = jwt.sign({ email: payload.email }, process.env.USER!, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ email: payload.email }, process.env.USER!, { expiresIn: "7d" });

    // 5️⃣ حفظ الـ refresh token في كوكيز
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 6️⃣ الرد للـ client
    res.json({
      success: true,
      token: accessToken,
      user: { email: payload.email, name: payload.name }
    });

  } catch (error) {
    console.error("💥 Error in Google Auth:", error);
    res.status(500).json({ success: false, error: "Authentication failed" });
  }
});



 export default router; 