const express = require("express")
const {
    sendMessage,
    getMessages,
    editMessage,
    deleteMessage,
    addReaction,
    markAsDelivered,
    markAsSeen,
    getUnreadCount
} = require("../controllers/messageController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/send",protect,sendMessage);
router.get("/list/:userId",protect,getMessages);
router.put("/edit/:messageId",protect,editMessage);
router.delete("/delete/:messageId",protect,deleteMessage);
router.put("/react/:messageId",protect,addReaction);
router.put("/delivered/:messageId",protect,markAsDelivered);
router.put("/seen/:messageId",protect,markAsSeen);
router.get("/unread",protect,getUnreadCount);

module.exports = router;