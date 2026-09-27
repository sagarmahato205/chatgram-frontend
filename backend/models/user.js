const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true
        },
        friendRequests:[
            {
                from:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User"
                },
                status:{
                    type:String,
                    enum:["pending","accepted","rejected"],
                    default:"pending"
                }
            }
        ],
        friends:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    },
    {
        timestamps:true
    }
);
const User = mongoose.model("User",userSchema);

module.exports = User;