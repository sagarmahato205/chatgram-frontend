const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender:{
            
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
            
        },
        receiver:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        message:{
            type:String,
            required:false,
            trim:true,
            default:""
        },
        type:{
            type:String,
            enum:["text","image","video"],
            default:"text"
        },
        mediaUrl:{
            type:String,
            default:null
        },
        replyTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
            default:null
        },
        reactions:[
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User"
                },
                reaction:{
                    type:String,
                    enum:["❤️","😂","👍","😢","😯"]
                }
            }
        ],
        edited:{
            type:Boolean,
            default:false
        },
        status:{
            type:String,
            enum:["sent","delivered","seen"],
            default:"sent"
        }
    },
    {
        timestamps:true
    }
);
const Message = mongoose.model("Message",messageSchema);

module.exports = Message;