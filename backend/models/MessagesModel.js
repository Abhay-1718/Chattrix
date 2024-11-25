import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function() {
            return this.messageType === "text"; // content is required for "text" messages only
        },
    },
    fileUrl: {
        type: String,
        required: function() {
            return this.messageType === "file"; // fileUrl is required for "file" messages only
        },
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});



// Middleware for debugging validation errors
messageSchema.post("validate", function (error, doc, next) {
    if (error.name === "ValidationError") {
        console.error("Validation Error:", error.message);
    }
    next(error);
});
const Message = mongoose.model("Messages", messageSchema);

export default Message