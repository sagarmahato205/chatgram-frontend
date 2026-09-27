const user = require("../models/user");

const searchUser = async (req,res)=>{
    try{
        const {query} = req.query;

        if(!query){
            return res.status(400).json({
                message:"Search query is required"
            });
        }

        const users = await user.find({
            $or:[
                {name:{$regex:query,$options:"i"}},
                {email:{$regex:query,$options:"i"}},
            ],
            _id:{$ne:req.user.userId}
        }).select("name email");

        res.status(200).json({
            users
        });
    }catch(error){
        console.log(error.message);

        res.status(500).json({
            message:"server error"
        });
    }
};

module.exports = {searchUser};