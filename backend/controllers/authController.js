const bcrypt = require("bcrypt");
const User = require("../models/user");
const JWT = require("jsonwebtoken");

const signup = async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message:"all feilds are required"
            });
        }

        const existinguser = await User.findOne({email});

        if(existinguser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedpassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedpassword
        });

        
        res.status(201).json({
            message:"User registered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server error"
        });
    }
};

const login = async (req,res)=>{
    try{
        const {email, password}= req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Email and password are required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Invalid Email"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid Password"
            })
        }
        const token = JWT.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        res.status(200).json({
            message:"Login sucessfully ",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message:"Server Error"
        });
    }
}

module.exports = {signup , login};