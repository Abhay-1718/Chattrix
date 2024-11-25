import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },

  profileSetup: {
    type: Boolean,
    default: false,
  },
});

// Hash the password before saving (only if it's modified)
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await genSalt(12);  // Salt rounds value of 12
    this.password = await hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
