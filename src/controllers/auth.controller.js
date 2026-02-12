import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

/*
Register User
POST  /api/auth/register
*/
export const userRegisterController = async (req, res) => {
  const { name, email, password } = req.body;

  const isExist = await userModel.findOne({ email });

  if (isExist) {
    return res.status(422).json({
      success: false,
      message: "User Already Exist !",
    });
  }

  const user = await userModel.create({
    name,
    email,
    password,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
};

/*
Login User
POST  /api/auth/login
*/

export const userLoginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Email or Password in Invalid !",
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: "Email or Password in Invalid !",
    });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
};
