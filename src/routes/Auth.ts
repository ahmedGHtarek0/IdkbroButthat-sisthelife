import express from 'express';
import { User, uservalidationSchema } from '../mongodb/user';
import { loginfunction, saveAdmin, savetheuser, sendemail } from '../services/Auth';
import { reqUser ,usermiddleware} from '../middleware/usermiddleware';
import  jwt  from 'jsonwebtoken';
import { client } from '..';
import dotenv from 'dotenv';
dotenv.config();
const router= express.Router();
router.post('/signupUsers',async(req,res)=>{
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



 export default router; 