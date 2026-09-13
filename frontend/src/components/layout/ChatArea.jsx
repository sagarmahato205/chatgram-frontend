    import React,{useEffect,useRef, useState} from 'react'
    import MessageBubble from '../chat/MessageBubble'
    import { useSocket } from '../../context/SocketContext'

    function ChatArea({
        chats,
        setChats,
        selectedChat,
        messages,
        setMessages,
        typingChatId,
        setTypingChatId,
        userStatus,
    }) {
        const chatEndRef = useRef(null);
        const [input , setInput] = useState("");
        const [editingId , setEditingId] = useState(null);
        const [editingText , setEditingText] = useState("");
        const [replyMessage , setReplyMessage]= useState(null);
        const socket = useSocket();

        useEffect(() => {
            if (!selectedChat) return;

            console.log("Selected Chat:", selectedChat);
            console.log("User Status:", userStatus);
            console.log(
                "Selected User Status:",    
                userStatus[selectedChat.id]
            );
        }, [selectedChat, userStatus]);
        
        const currentUser = JSON.parse(
            localStorage.getItem("chatgram_current_user")
        );
        const chatMessages = 
        selectedChat && currentUser
                ?messages[currentUser.id]?.[selectedChat.id] || []
                : [];

        useEffect(()=>{
            if(!selectedChat) return;
            const token = localStorage.getItem("chatgram_token");
            const fetchMessage = async ()=>{
                try{
                    const response = await fetch(
                        `https://chatgram-backend-xcxx.onrender.com/api/messages/list/${selectedChat.id}`,{
                            method:"GET",
                            headers:{
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const data = await response.json();

                    if(!response.ok){
                        console.log("Fetch message error:", data);
                        return;
                    }

                    console.log("Message fetched from backend",data);

                    const backendMessages = data.message;
                    console.log("Backend Messages:", backendMessages)

                    const formattedMessages = backendMessages.map((msg)=>({
                        id:msg._id,
                        text:msg.message,
                        sender:
                            String(msg.sender) === String(currentUser.id)
                                 ?"me"
                                 :"other",
                        status:
                            String(msg.receiver) === String(currentUser.id)
                                ?"seen"
                                :msg.status,
                        time:new Date(msg.createdAt).toLocaleTimeString([],{
                            hour:"2-digit",
                            minute:"2-digit",
                        }),
                        edited:msg.edited,
                        replyTo:msg.replyTo
                            ?{
                                id:msg.replyTo._id,
                                text:msg.replyTo.message,
                                sender:
                                    String(msg.replyTo.sender) === String(currentUser.id)
                                       ?"me"
                                       :"other",
                            }
                            :null,
                        reaction:msg.reactions?.[0]?.reaction || null,
                    }));

                    await markMessagesAsSeen(backendMessages);

                    setMessages((prevMessages)=>({
                        ...prevMessages,
                        [currentUser.id]:{
                            ...(prevMessages[currentUser.id] || {}),
                            [selectedChat.id]:formattedMessages,
                        },
                    }));
                }catch(error){
                    console.error("Fetch Message API error:", error);
                }
            };

            const markMessagesAsSeen = async (backendMessages) => {
                const token = localStorage.getItem("chatgram_token");

                const receivedMessages = backendMessages.filter(
                    (msg) =>
                        String(msg.receiver) === String(currentUser.id) &&
                        msg.status !== "seen"
                );

                for (const msg of receivedMessages) {
                    try {
                        const response = await fetch(
                            `https://chatgram-backend-xcxx.onrender.com/api/messages/seen/${msg._id}`,
                            {
                                method: "PUT",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (!response.ok) continue;

                        if (socket) {
                            socket.emit("message_seen", {
                                senderId: msg.sender,
                                messageId: msg._id,
                            });
                        }
                    } catch (error) {
                        console.error("Mark message seen error:", error);
                    }
                }

            };

            fetchMessage();

        },[selectedChat]);
        
        useEffect(()=>{
            if(!socket) return;

            const handleReceiveMessage = (newMessage)=>{
                console.log("New message received:",newMessage);

                const currentUser = JSON.parse(
                    localStorage.getItem("chatgram_current_user")
                );

                if(!currentUser) return;

                if (socket) {
                    socket.emit("message_delivered", {
                        senderId: newMessage.sender,
                        messageId: newMessage._id,
                    });
                }

                const token = localStorage.getItem("chatgram_token");

                fetch(`https://chatgram-backend-xcxx.onrender.com/api/messages/delivered/${newMessage._id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const senderId = newMessage.sender;

                const isCurrentChat =
                    selectedChat &&
                    String(selectedChat.id) === String(senderId);

                if (isCurrentChat) {
                    const token = localStorage.getItem("chatgram_token");

                    fetch(
                        `https://chatgram-backend-xcxx.onrender.com/api/messages/seen/${newMessage._id}`,
                        {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ).then(async (response) => {
                        if (!response.ok) return;

                        if (socket) {
                            socket.emit("message_seen", {
                                senderId: newMessage.sender,
                                messageId: newMessage._id,
                            });
                        }
                    }).catch((error) => {
                        console.error("Auto seen error:", error);
                    });
                }

                const formattedMessage = {
                    id:newMessage._id,
                    text:newMessage.message,
                    sender:"other",
                    status:isCurrentChat ? "seen" : newMessage.status ,
                    time: new Date(newMessage.createdAt).toLocaleTimeString([],{
                        hour:"2-digit",
                        minute:"2-digit",
                    }),
                    edited:newMessage.edited,
                    replyTo:newMessage.replyTo
                        ?{
                            id:newMessage.replyTo._id,
                            text:newMessage.replyTo.message,
                            sender:
                                String(newMessage.replyTo.sender) === 
                                String(currentUser.id)
                                    ?"me"
                                    :"other",
                        }
                        :null,
                    reaction: newMessage.reactions?.[0]?.reaction || null,
                };

                setChats((prevChats) => {
                    const incomingChat = prevChats.find(
                        (chat) => String(chat.id) === String(senderId)
                    );

                    if (!incomingChat) return prevChats;

                    const updatedChat = {
                        ...incomingChat,
                        lastMessage: newMessage.message,
                        time: "Now",
                    };

                    const remainingChats = prevChats.filter(
                        (chat) => String(chat.id) !== String(senderId)
                    );

                    return [updatedChat, ...remainingChats];
                });
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [currentUser.id]: {
                        ...(prevMessages[currentUser.id] || {}),
                        [senderId]: [
                            ...(prevMessages[currentUser.id]?.[senderId] || []),
                            formattedMessage,
                        ],
                    },
                }));
            };

            const handleMessageEdited = (updatedMessage) => {
                const currentUser = JSON.parse(
                    localStorage.getItem("chatgram_current_user")
                );

                if (!currentUser) return;

                const senderId = String(updatedMessage.sender);
                const receiverId = String(updatedMessage.receiver);

                const otherUserId =
                    senderId === String(currentUser.id)
                        ? receiverId
                        : senderId;

                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [currentUser.id]: {
                        ...(prevMessages[currentUser.id] || {}),
                        [otherUserId]: (
                            prevMessages[currentUser.id]?.[otherUserId] || []
                        ).map((msg) =>
                            msg.id === updatedMessage._id
                                ? {
                                    ...msg,
                                    text: updatedMessage.message,
                                    edited: true,
                                }
                                : msg
                        ),
                    },
                }));
            };

            const handleMessageDeleted = ({ messageId }) => {
                const currentUser = JSON.parse(localStorage.getItem("chatgram_current_user"));
                if (!currentUser) return;

                setMessages((prevMessages) => {
                    const userMessages = prevMessages[currentUser.id] || {};

                    const updatedChats = Object.fromEntries(
                    Object.entries(userMessages).map(([chatId, chatMessages]) => [
                        chatId,
                        chatMessages.filter((msg) => msg.id !== messageId),
                    ])
                    );

                    return {
                    ...prevMessages,
                    [currentUser.id]: updatedChats,
                    };
                });
            };
            const handleMessageReacted = (updatedMessage) => {
                const currentUser = JSON.parse(
                    localStorage.getItem("chatgram_current_user")
                );

                if (!currentUser) return;

                const senderId = String(updatedMessage.sender);
                const receiverId = String(updatedMessage.receiver);

                const otherUserId =
                    senderId === String(currentUser.id)
                        ? receiverId
                        : senderId;

                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [currentUser.id]: {
                        ...(prevMessages[currentUser.id] || {}),
                        [otherUserId]: (
                            prevMessages[currentUser.id]?.[otherUserId] || []
                        ).map((msg) =>
                            msg.id === updatedMessage._id
                                ? {
                                    ...msg,
                                    reaction:
                                        updatedMessage.reactions?.[0]?.reaction || null,
                                }
                                : msg
                        ),
                    },
                }));
            };

            socket.on("receive_message",handleReceiveMessage);
            socket.on("message_edited", handleMessageEdited);
            socket.on("message_deleted",handleMessageDeleted);
            socket.on("message_reacted", handleMessageReacted);

            return ()=>{
                socket.off("receive_message",handleReceiveMessage);
                socket.off("message_edited", handleMessageEdited);
                socket.off("message_deleted",handleMessageDeleted);
                socket.off("message_reacted", handleMessageReacted);
            };
        },[socket , selectedChat]);

        useEffect(() => {
            if (!socket) return;

            const handleMessageDelivered = ({ messageId }) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [currentUser.id]: {
                        ...(prevMessages[currentUser.id] || {}),
                        [selectedChat?.id]: (
                            prevMessages[currentUser.id]?.[selectedChat?.id] || []
                        ).map((msg) =>
                            msg.id === messageId
                                ? { ...msg, status: "delivered" }
                                : msg
                        ),
                    },
                }));
            };

            const handleMessageSeen = ({ messageId }) => {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [currentUser.id]: {
                        ...(prevMessages[currentUser.id] || {}),
                        [selectedChat?.id]: (
                            prevMessages[currentUser.id]?.[selectedChat?.id] || []
                        ).map((msg) =>
                            msg.id === messageId
                                ? { ...msg, status: "seen" }
                                : msg
                        ),
                    },
                }));
            };

            socket.on("message_delivered", handleMessageDelivered);
            socket.on("message_seen", handleMessageSeen);

            return () => {
                socket.off("message_delivered", handleMessageDelivered);
                socket.off("message_seen", handleMessageSeen);
            };
        }, [socket, selectedChat]);

        function updateChatList(lastMessage) {
            setChats((prevChats) => {
                const currentChat = prevChats.find(
                    (chat) => String(chat.id) === String(selectedChat.id)
                );

                if (!currentChat) return prevChats;

                const updatedChat = {
                    ...currentChat,
                    lastMessage: lastMessage,
                    time: "Now",
                };

                const remainingChats = prevChats.filter(
                    (chat) => String(chat.id) !== String(selectedChat.id)
                );

                return [
                    updatedChat,
                    ...remainingChats,
                ];
            });
        }


    async function handleSend() {
        if (!selectedChat) return;

        if (input.trim() === "") return;

        const currentUser = JSON.parse(
            localStorage.getItem("chatgram_current_user")
        );

        const token = localStorage.getItem("chatgram_token");


        if (editingId) {
            try {
                const response = await fetch(
                    `https://chatgram-backend-xcxx.onrender.com/api/messages/edit/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            message: input.trim(),
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log("Edit message error:", data);
                    return;
                }

                const updatedMessage = data.data;

                if (socket) {
                    socket.emit("message_edited", {
                        receiverId: selectedChat.id,
                        message: updatedMessage,
                    });
                }

                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [currentUser.id]: {
                        ...(prevMessages[currentUser.id] || {}),
                        [selectedChat.id]: (
                            prevMessages[currentUser.id]?.[selectedChat.id] || []
                        ).map((msg) =>
                            msg.id === editingId
                                ? {
                                    ...msg,
                                    text: updatedMessage.message,
                                    edited: true,
                                }
                                : msg
                        ),
                    },
                }));

                updateChatList(input.trim());

                setEditingId(null);
                setEditingText("");
                setInput("");

            } catch (error) {
                console.error("Edit Message API error:", error);
            }

            return;
        }

    
    try {
        const response = await fetch(
            "https://chatgram-backend-xcxx.onrender.com/api/messages/send",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiverId: selectedChat.id,
                    message: input.trim(),
                    replyTo: replyMessage?.id || null,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.log("Send message error:", data);
            return;
        }

        console.log("Message saved in backend:", data);

        const savedMessage = data.data;
        if(socket){
            socket.emit("send_message",savedMessage);
        }

        const formattedMessage = {
            id: savedMessage._id,
            text: savedMessage.message,
            sender: "me",
            status: savedMessage.status,
            time: new Date(
                savedMessage.createdAt
            ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            edited: savedMessage.edited,
            replyTo: replyMessage,
            reaction: null,
        };

        setMessages((prevMessages) => ({
            ...prevMessages,
            [currentUser.id]: {
                ...(prevMessages[currentUser.id] || {}),
                [selectedChat.id]: [
                    ...(prevMessages[currentUser.id]?.[selectedChat.id] || []),
                    formattedMessage,
                ],
            },
        }));

        updateChatList(input.trim());

        setInput("");
        setReplyMessage(null);

    } catch (error) {
        console.error("Message API error:", error);
    }
}

        function handleKeyDown(e){
            if(e.key === "Enter"){
                handleSend();
            }
        }
        useEffect(()=>{
            console.log(messages);
            chatEndRef.current?.scrollIntoView({
                behavior: "smooth",
            })
        },[messages]);


        async function handleDelete(messageId){
            const token = localStorage.getItem("chatgram_token");

            try{
                const response = await fetch(
                    `https://chatgram-backend-xcxx.onrender.com/api/messages/delete/${messageId}`,
                    {
                        method:"DELETE",
                        headers:{
                            Authorization:`Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();

                if(!response.ok){
                    console.log("Delete message error", data);
                    return;
                }

                console.log("Message delete from backend:", data);

                if (socket) {
                    socket.emit("message_deleted", {
                        receiverId: selectedChat.id,
                        messageId: messageId,
                    });
                }

                setMessages((prevMessages)=>({
                ...prevMessages,
                [currentUser.id]:{
                    ...(prevMessages[currentUser.id] || {}),
                    [selectedChat.id]:(
                        prevMessages[currentUser.id]?.[selectedChat.id] || []
                    ).filter((message)=>message.id !== messageId),
                },
            }));    
            }catch(error){
                console.error("Delete Message API error :", error);
            } 
        }
        function handleEdit(message){
            setEditingId(message.id);
            setEditingText(message.text);
            setInput(message.text);
        }
        function handleReply(message){
            setReplyMessage(message);
        }
        async function handleReaction(messageId,reaction){
            const token = localStorage.getItem("chatgram_token");

            try{
                const response = await fetch(
                    `https://chatgram-backend-xcxx.onrender.com/api/messages/react/${messageId}`,
                    {
                        method:"PUT",
                        headers:{
                            "Content-Type":"application/json",
                            Authorization:`Bearer ${token}`,
                        },
                        body:JSON.stringify({
                            reaction,
                        }),
                    }
                );
                const data = await response.json();

                if(!response.ok){
                    console.log("Reaction Error:",data);
                    return;
                }

                console.log("Reaction saved:",data);

                if (socket) {
                    socket.emit("message_reacted", {
                        receiverId: selectedChat.id,
                        message: data.data,
                    });
                }

                setMessages((prevMessages)=>({
                    ...prevMessages,
                    [currentUser.id]:{
                        ...(prevMessages[currentUser.id] || {}),
                        [selectedChat.id]:(
                            prevMessages[currentUser.id]?.[selectedChat.id] || []
                        ).map((msg)=>
                            msg.id === messageId
                               ?{
                                  ...msg,
                                  reaction,
                               }
                               :msg
                        ),
                    },
                }));
            }catch(error){
                console.error("Reaction API error:", error);
            }
        }
    return (
        <div className='flex-1 flex flex-col bg-gray-950'>
            <header className='flex items-center justify-between border-b border-gray-800 px-6 py-4'>
                <div className='flex items-center gap-3'>
                    <div className='h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center  font-bold'>
                        {selectedChat?.name?.charAt(0) || "?"}
                    </div>

                    <div>
                        <h2 className='font-semibold text-white'>{selectedChat?.name || "Select a chat"}</h2>
                        <p className='text-sm text-green-400'>
                            {!selectedChat
                                ? "No Chats Selected"
                                :  String(typingChatId) === String(selectedChat.id)
                                ? "Typing..."
                                : userStatus[selectedChat?.id]?.online
                                ? "online"
                                : userStatus[selectedChat?.id]?.lastSeen
                                ? `last seen ${new Date(
                                    userStatus[selectedChat.id].lastSeen
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}`
                                : "Offline"
                            }
                        </p>
                    </div>
                </div>
                <div className='flex gap-4 text-xl text-gray-400'>
                    <button className='hover:text-white transition'>📞</button>
                    <button className='hover:text-white transition'>📹</button>
                    <button className='hover:text-white transition'>⋮</button>
                </div>
            </header>

            <div className='flex-1 overflow-y-auto p-6'>
                {chatMessages.map((message)=>(
                <MessageBubble
                    key={message.id}
                    text={message.text}
                    isMe={message.sender === "me"}
                    status={message.status}
                    edited={message.edited}
                    onEdit={()=>handleEdit(message)}
                    time={message.time}
                    onDelete = {()=>handleDelete(message.id)}
                    onReply={()=>handleReply(message)}
                    onReaction={(reaction)=>handleReaction(message.id, reaction)}
                    reaction={message.reaction}
                    replyTo={message.replyTo}
                />
                ))}
                <div ref={chatEndRef}></div>
            </div>
            
            <footer className='border-t border-gray-800 p-4'>
                {
                    replyMessage && (
                        <div className='mb-3 flex items-center justify-between rounded-lg border-l-4 border-blue-500 bg-gray-800 p-3'>
                            <div>
                                <p className='text-xs text-blue-400 font-semibold'>
                                    Replying to {replyMessage.sender === 'me'?'you':selectedChat.name}
                                </p>
                                <p className='text-sm text-gray-300 truncate'>
                                    {replyMessage.text}
                                </p>
                            </div>
                            <button 
                                onClick={()=>setReplyMessage(null)}
                                className='text-gray-400 hover:text-white'>
                                    ✕
                                </button>
                        </div>
                    )
                }
                <div className='flex items-center gap-3'>
                    <input 
                    type="text" 
                    value={input}
                    placeholder='Type a message...'

                    onChange={(e) => {
                        setInput(e.target.value);

                        if (!selectedChat || !socket) return;

                        socket.emit("typing", {
                            receiverId: selectedChat.id,
                        });

                        clearTimeout(window.typingTimeout);

                        window.typingTimeout = setTimeout(() => {
                            socket.emit("stop_typing", {
                                receiverId: selectedChat.id,
                            });
                        }, 1000);
                    }}


                    onKeyDown={handleKeyDown}
                    className='flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white outline-none focus:border-blue-500'
                    />
                    <button 
                    onClick={handleSend}
                    className='rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700'>
                        Send
                    </button>
                </div>
            </footer>
        </div>
    )
    }

    export default ChatArea