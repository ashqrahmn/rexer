const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: {
        type: String, 
        required: true 
    },
    tags: { 
        type: [String], 
        default: [] 
    },
    bgColor: {
        type: String, 
        required: true 
    },
    isPinned: { 
        type: Boolean, 
        default: false 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    createdOn: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Note", noteSchema);