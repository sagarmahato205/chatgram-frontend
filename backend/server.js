require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const friendRoutes = require("./routes/friendRoutes");
const messageRoutes = require("./routes/messageRoutes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://frontend-eight-amber-3xdn3jnd0q.vercel.app",
        ],
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/ai",aiRoutes);

app.get("/", (req, res) => {
    res.send("Chatgram Backend is running");
});

const jwt = require("jsonwebtoken");

io.use((socket, next) => {
    try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.userId = decoded.userId;

         next();
    } catch (error) {
        next(new Error("Invalid or expired token"));
    }
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    console.log("User connected:", socket.userId);

    socket.join(socket.userId.toString());

    console.log("User joined room:", socket.userId);

    // User online
    io.emit("user_online", {
        userId: socket.userId.toString(),
    });

    socket.on("send_message", (message) => {
        const receiverId = message.receiver;

        io.to(receiverId.toString()).emit("receive_message", message);
    });

    socket.on("message_edited", ({ receiverId, message }) => {
        io.to(receiverId.toString()).emit("message_edited", message);
    });

    socket.on("message_deleted", ({ receiverId, messageId }) => {
        io.to(receiverId.toString()).emit("message_deleted", {
            messageId,
        });
    });

    socket.on("message_reacted", ({ receiverId, message }) => {
        io.to(receiverId.toString()).emit("message_reacted", message);
    });

    socket.on("message_delivered", ({ senderId, messageId }) => {
        io.to(senderId.toString()).emit("message_delivered", {
            messageId,
        });
    });

    socket.on("message_seen", ({ senderId, messageId }) => {
        io.to(senderId.toString()).emit("message_seen", {
            messageId,
        });
    });

    socket.on("typing", ({ receiverId }) => {
        io.to(receiverId.toString()).emit("user_typing", {
            userId: socket.userId.toString(),
        });
    });

    socket.on("stop_typing", ({ receiverId }) => {
        io.to(receiverId.toString()).emit("user_stop_typing", {
            userId: socket.userId.toString(),
        });
    });

    // User offline
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);

        io.emit("user_offline", {
            userId: socket.userId.toString(),
            lastSeen:new Date(),
        });
    });
});

connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Chatgram backend is running on port ${PORT}`);
});