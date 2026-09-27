const User = require("../models/user");

const sendFriendRequest = async (req,res)=>{
    try{
        const {userId} = req.body;

        if(!userId){
            return res.status(400).json({
                message:"user Id required"
            });
        }
        if(userId ===req.user.userId){
            return res.status(400).json({
                message:"You cannot send request to yourself"
            });
        }

        const receiver = await User.findById(userId);

        if(!receiver){
            return res.status(400).json({
                message:"User not found"
            });
        }

        const alreadyFriends = receiver.friends.includes(req.user.userId);

        if(alreadyFriends){
            return res.status(400).json({
                message:"you are already Friends"
            });
        }

        const alreadyRequested = receiver.friendRequests.some(
            (request)=>
                request.from.toString() === req.user.userId &&
                request.status === "pending"
        );

        if(alreadyRequested){
            return res.status(400).json({
                message:"Friend request already sent"
            });
        }
        receiver.friendRequests.push({
            from:req.user.userId
        });

        await receiver.save();

        res.status(200).json({
            message:"Friend request sent successfully"
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
};

const acceptFriendRequest = async (req,res)=>{
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({
                message:"User Id is required"
            });
        }

        const user = await User.findById(req.user.userId);

        if(!user){
            return res.status(400).json({
                message:"User not found"
            });
        }

        const request = user.friendRequests.find(
            (request)=>
                request.from.toString() === userId &&
                request.status === "pending"
        );

        if(!request){
            return res.status(400).json({
                message:"Friend request not found"
            });
        }

        user.friendRequests = user.friendRequests.filter(
            (request) => request.from.toString() !== userId
        );

        user.friends.push(userId);

        await user.save();

        const sender = await User.findById(userId);

        sender.friends.push(req.user.userId);

        await sender.save();

        res.status(200).json({
            message:"Friend request accepted successfully"
        });


    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        })
    }
}

const rejectFriendRequest = async (req,res)=>{
    try{
        const { userId } = req.body;

        if(!userId){
            return res.status(400).json({
                message:"User id required"
            });
        }

        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }

        const request = user.friendRequests.find(
            (request)=>
                request.from.toString() === userId &&
                request.status === "pending"
            
        );

        if(!request){
            return res.status(400).json({
                message:"Friend request not found"
            });
        }

        request.status = "rejected";
        await user.save();
        
        res.status(200).json({
            message:"Friend request rejected successfully"
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
};

const getFriends = async (req,res)=>{
    try{
        const user = await User.findById(req.user.userId).populate("friends","name email");

        if(!user){
            return res.status(400).json({
                message:"User not found"
            });
        }
        res.status(200).json({
            friends:user.friends
        });
    }catch(error){
        console.log(error.message);

        res.status(400).json({
            message:"Server Error"
        });
    }
}

const getPendingRequests = async (req,res)=>{
    try{
        const user = await User.findById(req.user.userId).populate("friendRequests.from","name email");

        if(!user){
            return res.status(400).json({
                message:"User not found"
            });
        }

        const pendingRequest = user.friendRequests.filter((request)=>request.status === "pending");

        res.status(200).json({
            request:pendingRequest
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    getPendingRequests
};