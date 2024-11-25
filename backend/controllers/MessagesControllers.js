import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    // Corrected condition to check both user1 and user2
    if (!user1 || !user2) {
      return res.json({
        message: "Both userId and recipient ID are required",
        status: false,
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: user1,
          recipient: user2,
        },
        {
          sender: user2,
          recipient: user1,
        },
      ],
    });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
      status: false,
    });
  }
};


export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    console.log(`File saved to: ${fileName}`);

    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname}"`);

    // Send the file path back in the response
    return res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
      status: false,
    });
  }
};

