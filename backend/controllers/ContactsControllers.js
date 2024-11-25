import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

// Function to search contacts based on a search term
export const searchContacts = async (req, res, next) => {
  try {
    // Extract the search term from the request body
    const { searchTerm } = req.body;

    // Check if searchTerm is provided, return error if not
    if (searchTerm === undefined || searchTerm === null) {
      return res.json({
        message: "searchTerm is required", // Message indicating search term is required
        status: false,
      });
    }

    // Sanitize the searchTerm to prevent any special character issues in regular expression
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g, // Escape special characters
      "\\$&" // Escape the special characters to avoid errors
    );

    // Create a regular expression for case-insensitive search
    const regex = new RegExp(sanitizedSearchTerm, "i");

    // Query to search users excluding the current user and matching first name, last name, or email with the regex
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } }, // Exclude the current user (req.userId)
        {
          $or: [
            { firstName: regex }, // Match first name
            { lastName: regex }, // Match last name
            { email: regex }, // Match email
          ],
        },
      ],
    });

    // Return the found contacts as the response
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error); // Log the error for debugging
    return res.json({
      message: "internal server error", // Return an error message if something goes wrong
      status: false,
    });
  }
};

// Function to get contacts for the DMList (Direct Message List)
export const getContactsForDMLIst = async (req, res, next) => {
  try {
    let { userId } = req; // Extract the userId from the request (it's assumed that req has userId from authentication)
    userId = new mongoose.Types.ObjectId(userId); // Convert the userId into a MongoDB ObjectId

    // Aggregate query to fetch contacts based on messages
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }], // Match messages where the user is either the sender or recipient
        },
      },
      {
        $sort: { timestamp: -1 }, // Sort by timestamp in descending order to get the most recent messages
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] }, // If the current user is the sender, use the recipient as the contact
              then: "$recipient",
              else: "$sender", // Else use the sender as the contact
            },
          },
          lastMessageTime: { $first: "$timestamp" }, // Get the timestamp of the last message in the conversation
        },
      },
      {
        $lookup: {
          from: "users", // Join with the 'users' collection to get user information
          localField: "_id", // Use the contact _id (either sender or recipient) to join
          foreignField: "_id", // Match _id in the 'users' collection
          as: "contactInfo", // Output the contact details as 'contactInfo'
        },
      },
      {
        $unwind:"$contactInfo",
      
      },
      {
        $project:{
          _id:1,
          lastMessageTime:1,
          email:"$contactInfo.email",
          firstName:"$contactInfo.firstName",
          lastName:"$contactInfo.lastName",
          image:"$contactInfo.image",
        }
      },
      {
        $sort:{
          lastMessageTime:-1
        }
      }
    ]);

    // Return the contacts with additional info as the response
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error); // Log any errors for debugging
    return res.json({
      message: "internal server error", // Return a generic error message
      status: false,
    });
  }
};



// export const getAllContacts = async (req, res, next) => {
//   try {
//     const users = await User.find({_id:{$ne:req.userId }}, "firstName lastName _id email");

//       const contacts = users.map((user) => ({
//         label:  user.firstName ? `${user.firstName} ${user.lastName}`  : user.email,
//       }))  
    
  
//     return res.status(200).json({ contacts });
//   } catch (error) {
//     console.log(error); // Log the error for debugging
//     return res.json({
//       message: "internal server error", // Return an error message if something goes wrong
//       status: false,
//     });
//   }
// };

