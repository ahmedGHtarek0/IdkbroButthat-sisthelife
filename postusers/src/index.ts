import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port= 4000

 


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
