import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required !"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, ["Email is required !"]],
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email address",
      ],
      unique: [true, "Email already exists !"],
    },
    password: {
      type: String,
      required: [true, "Password is required !"],
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least: 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      ],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async (next) => {
  if (!this.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  return next();
});

userSchema.method.comparePassword = async (password) => {
  return await bcrypt.compare(password, this.password);
};

export const userModel = mongoose.model("User", userSchema);
