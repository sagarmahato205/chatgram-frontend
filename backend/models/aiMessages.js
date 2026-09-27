const mongoose = require("mongoose");

const aiMessageSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        prompt:{
            type:String,
            required:true,
            trim:true,
        },
        response:{
            type:String,
            required:true,
        },
    },
    {
        timestamps:true,
    }
);

const AIMessage = mongoose.model("AIMessage",aiMessageSchema);
module.exports = AIMessage;