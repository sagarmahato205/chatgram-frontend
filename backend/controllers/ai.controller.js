const {generateAIResponse} = require("../services/ai.services");
const AIMessage = require("../models/aiMessages")

const chatWithAI = async (req,res,next) =>{
        try{
            const prompt = req.body.prompt;

            if(!prompt || !prompt.trim()){
                 return res.status(400).json({
                    success: false,
                    message: "Prompt is required",
                });
            }

            const response = await generateAIResponse(prompt);

            const aiMessage = await AIMessage.create({
                user: req.user.userId,
                prompt: prompt.trim(),
                response,
            });

            res.status(201).json({
                success: true,
                response: aiMessage.response,
            });
            
        }catch(error){
            console.log("Error occurred" , error);
            next(error);
        }
}
const getAIHistory = async (req,res,next)=>{
    try{
        const messages = await AIMessage.find({
            user:req.user.userId,
        }).sort({ createdAt: 1 });

        res.status(201).json({
            success:true,
            messages,
        });
    }catch(error){
        console.log("Error Occurred", error);
        next(error);
    }
};

module.exports = {
    chatWithAI,
    getAIHistory
};