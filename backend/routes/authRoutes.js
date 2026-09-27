const express = require("express");
const {signup , login} = require("../controllers/authController");
const {searchUser} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/signup',signup);
router.post("/login",login);
router.get("/protected",protect,searchUser,(req,res)=>{
    res.status(200).json({
        message:"You have access to protect route 🔐",
        user:req.user
    });
});

module.exports = router;