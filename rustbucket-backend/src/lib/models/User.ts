import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  favoriteProductIds: mongoose.Types.ObjectId[];
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    fullName: { type: String, required: true },
    favoriteProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    // Set by /auth/forgot-password, cleared by /auth/reset-password. Only
    // the SHA-256 hash of the token is stored — never the raw token — same
    // reason passwords are hashed: a DB leak shouldn't hand out working
    // reset links.
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
