const express = require("express");

const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    getPendingRequests
} = require("../controllers/friendController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send",protect,sendFriendRequest);
router.post("/accept",protect,acceptFriendRequest);
router.post("/reject",protect,rejectFriendRequest);
router.get("/list",protect,getFriends);
router.get("/pending",protect,getPendingRequests);

module.exports = router;