const Message = require("../models/message");
const User  = require("../models/user");
const mongoose = require("mongoose");

const sendMessage = async (req,res)=>{
    try{
       const {receiverId , message , replyTo , type , mediaUrl} = req.body;

       if(!receiverId ){
        return res.status(400).json({
            message:"Receiver Id are required"
        });
       }
       if(!message && !mediaUrl){
        return res.status(400).json({
            message:"Message or media is required"
        })
       }

       if(receiverId === req.user.userId){
        return res.status(400).json({
            message:"You can't send message to yourself"
        });
       }

       const sender = await User.findById(req.user.userId);
       const receiver =  await User.findById(receiverId);

       if(!sender || !receiver){
        return res.status(404).json({
            message:"User not found"
        });
       }

       const areFriends = sender.friends.some(
        (friendId)=>friendId.toString() === receiverId
       );

       if(!areFriends){
        return res.status(403).json({
            message:"you can only message to your friends"
        });
       }

       if(replyTo){
        const originalMessage = await Message.findById(replyTo);

        if(!originalMessage){
            return res.status(404).json({
                message:"Reply message not found"
            });
        }
       }
       const newMessage = await Message.create({
        sender:req.user.userId,
        receiver:receiverId,
        message:message || "",
        type:type || "text",
        mediaUrl:mediaUrl || null,
        replyTo:replyTo || null
       });

       res.status(201).json({
        message:"Message sent successfully",
        data:newMessage
       })

    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
}

const getMessages = async(req,res)=>{
    try{
        const {userId} = req.params;
        if(!userId){
            return res.status(401).json({
                message:"User Id is required"
            });
        }

        const message = await Message.find({
            $or:[
                {
                    sender:req.user.userId,
                    receiver:userId
                },{
                    sender:userId,
                    receiver:req.user.userId
                }
            ]
        }).populate("replyTo","sender receiver message createdAt")
        .sort({createdAt:1});

        res.status(200).json({
            message
        });
    }catch(error){
        console.log(error.message);

        res.status(500).json({
            message:"Server Error"
        });
    }
};
const editMessage = async (req,res)=>{
    try{
        const {messageId} = req.params;
        const {message} = req.body;

        if(!messageId || !message){
            return res.status(400).json({
                message:"Message Id and message are required"
            });
        }

        const existingMessage = await Message.findById(messageId);

        if(!existingMessage){
            return res.status(404).json({
                message:"Message not found"
            });
        }

        if(existingMessage.sender.toString() !==  req.user.userId){
            return res.status(403).json({
                message:"Your can only edit your own message"
            });
        }

        existingMessage.message = message.trim();
        existingMessage.edited = true;
        await existingMessage.save();

        res.status(200).json({  
            message:"Message Updated successfully",
            data:existingMessage
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server error"
        });
    }
};

const deleteMessage = async (req,res)=>{
    try{
        const {messageId} = req.params;

        if(!messageId){
            return res.status(400).json({
                message:"Message Id required"
            });
        }

        const existingMessage = await Message.findById(messageId);

        if(!existingMessage){
            return res.status(404).json({
                message:"Message is not found"
            });
        }

        if(existingMessage.sender.toString() !== req.user.userId){
            return res.status(403).json({
                message:"You can only delete your own message"
            });
        }

        await Message.findByIdAndDelete(messageId);

        res.status(200).json({
            message:"Message deleted successfully"
        });
    }catch(error){
        console.log(error.message);

        res.status(500).json({
            message:"Server error"
        });
    }
}

const addReaction = async (req,res)=>{
    try{
        const {messageId} = req.params;
        const {reaction } = req.body;

        if(!messageId || !reaction){
            return res.status(400).json({
                message:"MessageId and reaction are required"
            });
        }

        const existingMessage = await Message.findById(messageId);

        if(!existingMessage){
            return res.status(404).json({
                message:"Message not found"
            });
        }

        const isParticipant = 
            existingMessage.sender.toString() === req.user.userId ||
            existingMessage.receiver.toString() === req.user.userId;

        if(!isParticipant){
            return res.status(403).json({
                message:"You can only react to message in your conversation"
            });
        }

        const existingReaction = existingMessage.reactions.find(
            (item)=>item.user.toString() === req.user.userId
        );

        if(existingReaction){
            existingReaction.reaction = reaction;
        }else{
            existingMessage.reactions.push({
                user:req.user.userId,
                reaction
            });
        }

        await existingMessage.save();

        res.status(200).json({
            message:"Reaction added successfully",
            data:existingMessage
        })
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
}

const markAsDelivered = async (req,res)=>{
    try{
        const {messageId} = req.params;
        if(!messageId){
            return res.status(400).json({
                message:"Message Id is required"
            });
        }

        const message = await Message.findById(messageId);
        if(!message){
            return res.status(404).json({
                message:"Message not found"
            });
        }

        if(message.receiver.toString() !== req.user.userId){
            return res.status(403).json({
                message:"You can only mark received message as delivered"
            });
        }

        if(message.status === "sent"){
            message.status = "delivered";
            await message.save();
        }

        res.status(200).json({
            message:"Message marked as delivered",
            data:message
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
}

const markAsSeen = async (req,res)=>{
    try{
        const {messageId} = req.params;

        if(!messageId){
            return res.status(400).json({
                message:"Message Id is required"
            });
        }

        const message = await Message.findById(messageId);

        if(!message){
            return res.status(404).json({
                message:"Message not found"
            });
        }

        if(message.receiver.toString() !== req.user.userId){
            return res.status(403).json({
                message:"You can only mark received message as seen"
            });
        }
        message.status = "seen";

        await message.save();

        res.status(200).json({
            message:"Message marked as seen",
            data:message
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
}

const getUnreadCount = async (req,res)=>{
    try{
        const unreadMessages = await Message.aggregate([
            {
                $match:{
                    receiver: new mongoose.Types.ObjectId(req.user.userId),
                    status:{$ne:"seen"}
                }
            },
            {
                $group:{
                    _id:"$sender",
                    unreadCount:{$sum:1}
                }
            }
        ]);

        res.status(200).json({
            unreadMessages
        });

    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
}

module.exports = {
    sendMessage,
    getMessages,
    editMessage,
    deleteMessage,
    addReaction,
    markAsDelivered,
    markAsSeen,
    getUnreadCount
};