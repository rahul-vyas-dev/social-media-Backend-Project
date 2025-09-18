import mongoose, { Schema} from "mongoose";
import bcrypt from "bcrypt";  
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

dotenv.config();

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    fullName: { type: String, required: true, trim: true },
    avatar: { type: String, required: true },
    coverImage: { type: String },
    watchlist: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    password: { type: String, required: true },
    refreshToken:String, // 7 days
    AvatarPublicId:String,
    CoverImagePublicId:String,
});

userSchema.pre('save',async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {  
    const token = jwt.sign(
      {
        _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );
    return token;
}

userSchema.methods.generateRefreshToken = function() {
    const refreshToken = jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
    this.refreshToken = refreshToken; 
    this.save();
    return refreshToken;
}

export const User = mongoose.model('User', userSchema);