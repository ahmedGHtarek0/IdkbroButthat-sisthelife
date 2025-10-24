import mongoose,{Document,Schema} from "mongoose";
import zod from "zod";
interface IProfileImage extends Document{
    userId: mongoose.Types.ObjectId;
    SmallimageUrl: string;
    BigimageUrl: string;
    createdAt: Date;
}
const ProfileImageSchema: Schema = new Schema({
    userId: {type: mongoose.Types.ObjectId, required: true, unique: true, ref : 'User'},
    SmallimageUrl: {type: String,default:''},
    BigimageUrl: {type: String, default:''},
    createdAt: {type: Date, default: Date.now}
});
const ProfileImage = mongoose.model<IProfileImage>('ProfileImage', ProfileImageSchema);

const validateimageSchemasmall =zod.object({
    SmallimageUrl: zod.string().url()
})
const validateimageSchemaBig =zod.object({
  
    BigimageUrl: zod.string().url()
})
export {validateimageSchemasmall,validateimageSchemaBig,ProfileImage};

