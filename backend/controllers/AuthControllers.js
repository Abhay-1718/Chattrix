import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import pkg from "jsonwebtoken";
import { response } from "express";
const { sign } = pkg;
import { renameSync, unlinkSync } from "fs";
import path from "path";

const maxAge = 3 * 24 * 60 * 60 * 1000;

// Create JWT token
const createToken = (email, userId) => {
  return sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        status: false,
        message: "email and password is required ",
      });
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
      message: "user created",
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "internal server error",
      status: false,
    });
  }
};



export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        status: false,
        message: "Email and password are required.",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        status: false,
        message: "User not found with the provided email.",
      });
    }

    

    // Compare the password from the request with the hashed password in the DB
    const passwordMatch = await compare(password, user.password);

  

    if (!passwordMatch) {
      return res.json({
        status: false,
        message: "Incorrect password.",
      });
    }

    // Create and send the JWT token
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
      status: true,
      message: "Login successful.",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: "Internal server error.",
    });
  }
};
export const getUserinfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.json({
        status: false,
        message: "user with given email not found ",
      });
    }

    return res.json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
      status: true,
      message: "user logged in",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "internal server error",
      status: false,
    });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.json({
        status: false,
        message: "FirstName and LastName is required ",
      });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return res.json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      status: true,
      message: "user logged in",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "internal server error",
      status: false,
    });
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.json({
        message: "File is required",
        status: false,
      });
    }

    // Get the file extension from mimetype (e.g., "image/png")
    const fileExtension = path.extname(req.file.originalname); // Extract file extension

    // Create a unique file name with the correct extension
    const date = Date.now();
    let fileName = `uploads/profiles/${date}${fileExtension}`;

    // Rename the file with the correct extension
    renameSync(req.file.path, fileName);

    // Update user profile with the new image path
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.json({
      image: updatedUser.image,
      status: true,
      message: "Profile image updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
      status: false,
    });
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        message: "user not found",
        status: false,
      });
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.json({
      status: true,
      message: "Profile image removed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "internal server error",
      status: false,
    });
  }
};



export const logout = async (req, res, next) => {
  try {

res.cookie("jwt", "",  {maxAge:1, secure:true, sameSite:"None"})



    return res.json({
      status: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "internal server error",
      status: false,
    });
  }
};
