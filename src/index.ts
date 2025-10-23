import mongoose  from 'mongoose';
 import express from 'express'
import Auth from './routes/Auth';
import dotenv from 'dotenv';
import {createClient} from 'redis'
import cookieParser from "cookie-parser";


dotenv.config();
 const app= express()
    const port = process.env.PORT
    const mongoUrl= process.env.Data_Base_Url ?? 'typescript Error'
mongoose.connect(mongoUrl).
then(() => console.log('anythingatall done')).
catch((i) => console.log('errr', i));



export const client = createClient({
    username: 'default',
    password: 'dgrUmo5n66pYXv1wiOHvStQuq7wCtFyS',
    socket: {
        host: 'redis-18355.c61.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 18355
    }
});

(async () => {
  try {;

    client.on("error", (err) => console.log("❌ Redis Client Error:", err));

    await client.connect();
    console.log("✅ Redis is connected successfully");

  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
  }
})();
/*  the all middleware  */
app.use(cookieParser());
app.use(express.json())
/* the main routes*/
app.use('/auth',Auth)
app.listen(port, ()=>{
     console.log(`Server is running on http://localhost:${port}`);
 }  )
 /* */