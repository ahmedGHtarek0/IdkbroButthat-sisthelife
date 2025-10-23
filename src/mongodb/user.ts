import mongoose,{Document,Schema} from "mongoose";
import { resolveModuleName } from "typescript";
import zod from "zod";
import de from "zod/v4/locales/de.js";
interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role:'admin'|'user'
    phone: string;
}
const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},    // the n+1 problem 
    password: {type: String, required: true},
    phone: {type: String, required: false,default:''},
    role: {type: String, enum: ['admin', 'user'], default: 'user',required:true}
});
const User = mongoose.model<IUser>('User', UserSchema);//  best pratcice to validate data before sending to database
const uservalidationSchema = zod.object({
    name: zod.string().min(2).max(100).optional(),
    email: zod.string().email(),
    password: zod.string().min(6)
});
export {uservalidationSchema,User};