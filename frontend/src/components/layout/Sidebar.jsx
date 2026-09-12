import React, { useState , useEffect } from 'react'
import ChatItem from '../sidebar/ChatItem'
import FriendRequestItem from '../sidebar/FriendRequestItem'
import FriendItem from '../sidebar/FriendItem'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../../context/SocketContext'

    function Sidebar({
        chats,
        setChats,
        selectedChat,
        unreadCount,
        setSelectedChat,
        friends,
        setFriends,
        setFriendRequests,
        friendRequests,
        typingChatId,
        setTypingChatId,
        userStatus
    }){
        const navigate = useNavigate();
        const socket = useSocket();

        useEffect(() => {
            if (!socket) return;

            const handleReceiveMessage = (newMessage) => {
                const currentUser = JSON.parse(
                    localStorage.getItem("chatgram_current_user")
                );

                if (!currentUser) return;

                const senderId = String(newMessage.sender);

                // Agar message current selected chat ka nahi hai,
                // to us chat ka unread count increase hoga.
                if (String(selectedChat?.id) !== senderId) {
                    setChats((prevChats) =>
                        prevChats.map((chat) =>
                            String(chat.id) === senderId
                                ? {
                                    ...chat,
                                    unread: (chat.unread || 0) + 1,
                                }
                                : chat
                        )
                    );
                }
            };

            socket.on("receive_message", handleReceiveMessage);

            return () => {
                socket.off("receive_message", handleReceiveMessage);
            };
        }, [socket, selectedChat, setChats]);

        const [search , setSearch] = useState("");

        useEffect(() => {
            if (friends.length === 0) return;

            const fetchUnreadMessages = async () => {
                const token = localStorage.getItem("chatgram_token");

                if (!token) return;

                try {
                    const response = await fetch(
                        "https://chatgram-backend-xcxx.onrender.com/api/messages/unread",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        console.log("Unread messages error:", data);
                        return;
                    }

                    setChats((prevChats) =>
                        prevChats.map((chat) => {
                            const unreadData = data.unreadMessages.find(
                                (item) =>
                                    String(item._id) === String(chat.id)
                            );

                            return {
                                ...chat,
                                unread: unreadData
                                    ? unreadData.unreadCount
                                    : 0,
                            };
                        })
                    );
                } catch (error) {
                    console.error(
                        "Unread messages API error:",
                        error
                    );
                }
            };

            fetchUnreadMessages();
        }, [friends, setChats]);

       const [searchUsers, setSearchUsers] = useState([]);

        async function handleAccept(request) {
            const token = localStorage.getItem("chatgram_token");

            if (!token) {
                alert("Please login again");
                return;
            }

            try {
                const response = await fetch(
                    "https://chatgram-backend-xcxx.onrender.com/api/friends/accept",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userId: request.id,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Failed to accept request");
                    return;
                }

                // Request remove
                setFriendRequests((prev) =>
                    prev.filter((item) => item.id !== request.id)
                );

                // Friend add
                const newFriend = {
                    id: request.id,
                    name: request.name,
                    email: request.email,
                    isOnline: false,
                };

                setFriends((prev) => {
                    const alreadyExists = prev.some(
                        (friend) => String(friend.id) === String(request.id)
                    );

                    if (alreadyExists) return prev;

                    return [...prev, newFriend];
                });

                alert("Friend request accepted.");

            } catch (error) {
                console.error("Accept Friend Request API error:", error);
                alert("Unable to connect to server");
            }
        }

        async function handleReject(id) {
            const token = localStorage.getItem("chatgram_token");

            if (!token) {
                alert("Please login again");
                return;
            }

            try {
                const response = await fetch(
                    "https://chatgram-backend-xcxx.onrender.com/api/friends/reject",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userId: id,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Failed to reject request");
                    return;
                }

                setFriendRequests((prev) =>
                    prev.filter((item) => item.id !== id)
                );

                alert("Friend request rejected.");

            } catch (error) {
                console.error("Reject Friend Request API error:", error);
                alert("Unable to connect to server");
            }
        }

        useEffect(() => {
            const fetchFriends = async () => {
                const token = localStorage.getItem("chatgram_token");

                if (!token) return;

                try {
                    const response = await fetch(
                        "https://chatgram-backend-xcxx.onrender.com/api/friends/list",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        console.log("Fetch friends error:", data);
                        return;
                    }

                    const formattedFriends = data.friends.map((friend) => ({
                        id: friend._id,
                        name: friend.name,
                        email: friend.email,
                        isOnline: false,
                    }));

                    setFriends(formattedFriends);

                } catch (error) {
                    console.error("Fetch friends API error:", error);
                }
            };

            fetchFriends();
        }, [setFriends]);


        useEffect(() => {
            const fetchPendingRequests = async () => {
                const token = localStorage.getItem("chatgram_token");

                if (!token) return;

                try {
                    const response = await fetch(
                        "https://chatgram-backend-xcxx.onrender.com/api/friends/pending",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        console.log("Fetch pending requests error:", data);
                        return;
                    }

                    const formattedRequests = data.request.map((request) => ({
                        id: request.from._id,
                        name: request.from.name,
                        email: request.from.email,
                    }));

                    setFriendRequests(formattedRequests);

                } catch (error) {
                    console.error("Fetch pending requests API error:", error);
                }
            };

            fetchPendingRequests();
        }, [setFriendRequests]);
 
        async function handleSendRequest(user) {
            const token = localStorage.getItem("chatgram_token");

            if (!token) {
                alert("Please login again");
                return;
            }

            try {
                const response = await fetch(
                    "https://chatgram-backend-xcxx.onrender.com/api/friends/send",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userId: user._id,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Failed to send friend request");
                    return;
                }

                alert("Friend Request sent.");
                setSearch("");

            } catch (error) {
                console.error("Send Friend Request API error:", error);
                alert("Unable to connect to server");
            }
        }
        function handleFriendClick(friend) {
            const existingChat = chats.find(
                (chat) => String(chat.id) === String(friend.id)
            );

            if (existingChat) {
                setSelectedChat(existingChat);
                return;
            }

            const newChat = {
                id: friend.id,
                name: friend.name,
                lastMessage: "Start Chatting...",
                time: "Now",
                unread: 0,
            };

            setChats((prevChats) => [
                ...prevChats,
                newChat,
            ]);

            setSelectedChat(newChat);
        }

        const filteredChats = chats.filter((chat)=>{
            return chat.name.toLowerCase().includes(search.toLowerCase());            
        });

        useEffect(() => {
            const searchBackendUsers = async () => {
                if (!search.trim()) {
                    setSearchUsers([]);
                    return;
                }

                const token = localStorage.getItem("chatgram_token");

                if (!token) return;

                try {
                    const response = await fetch(
                        `https://chatgram-backend-xcxx.onrender.com/api/users/search?query=${encodeURIComponent(search)}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        console.log("User search error:", data);
                        return;
                    }

                    const filteredUsers = data.users.filter(
                        (user) =>
                            !friends.some(
                                (friend) =>
                                    String(friend.id) === String(user._id)
                            )
                    );

                    setSearchUsers(filteredUsers);

                } catch (error) {
                    console.error("User search API error:", error);
                }
            };

            searchBackendUsers();
        }, [search, friends]);

        function handleChatClick(chat) {
            setSelectedChat(chat);

            setChats((prevChats) =>
                prevChats.map((item) =>
                    String(item.id) === String(chat.id)
                        ? { ...item, unread: 0 }
                        : item
                )
            );
        }
        function handleLogout() {
            localStorage.removeItem("chatgram_current_user");
            localStorage.removeItem("chatgram_token");

            window.dispatchEvent(new Event("chatgram_logout"));

            navigate("/login");
        }
        
    return (
        <div className='w-80 h-screen flex flex-col border-r border-gray-800 bg-gray-900'>
            <header className='flex items-center justify-between border-b border-gray-800 p-4'>
                <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-xl font-bold'>
                        CG
                    </div>
                    <h2 className='text-xl font-semibold text-white'>
                        ChatGram
                    </h2>
                </div>
                <div className="relative">
                    <button className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-xl hover:bg-gray-700 transition'>
                        😊
                    </button>

                    {chats.some((chat) => (chat.unread || 0) > 0) && (
                        <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-500 border-2 border-gray-900"></span>
                    )}
                </div>
            </header>
            <section className='p-4'>
                <input 
                type="text"
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
                placeholder='Search chats...' 
                className='w-full rounded-lg bg-gray-800 border border-gray-700  px-4 py-2 text-white placeholder-gray-400 outline-none focus:border-blue-500 '
                />
            </section>
            <section className='px-4 pb-4'>
                <h3 className='mb-3 text-sm font-semibold text-gray-400 uppercase'>
                    Search Results
                </h3>

                {
                    search.trim() !== "" &&
                    searchUsers.map((user)=>(
                        <div
                          key={user._id}
                          className='mb-2 flex items-center justify-between rounded-lg bg-gray-800 p-3  '
                        >
                            <div>
                                <p className='font-medium text-white '>{user.name}</p>
                                <p className='text-xs text-gray-400'>
                                    {userStatus[user._id]?.online ? "Online" : "Offline"}
                                </p>
                            </div>
                            <button
                              onClick={()=>handleSendRequest(user)}
                              className='rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
                            >
                               Send Request
                            </button>
                        </div>
                    ))
                }
            </section>
            <div className='flex-1 overflow-y-auto'>
                    <section className='px-4 pb-4'>
                        <h3 className='mb-3 text-sm font-semibold text-gray-400 uppercase'>
                            Friends
                        </h3>
                        {
                            friends.map((friend)=>(
                                <FriendItem 
                                    key={`friend${friend.id}`}
                                    name={friend.name}
                                    isOnline={userStatus[friend.id]?.online || false}
                                    onClick={()=>handleFriendClick(friend)}
                                />
                            ))
                        }
                    </section>
                    <section className="px-4 pb-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase">
                            Friend Requests
                        </h3>

                        {friendRequests.map((request) => (
                            <FriendRequestItem
                            key={`request${request.id}`}
                            name={request.name}
                            onAccept={()=>handleAccept(request)}
                            onReject={()=>handleReject(request.id)}
                            />
                        ))}
                    </section>

                    <section className='px-4 pb-4'>
                     <h3 className='mb-3 text-sm font-semibold text-gray-400 uppercase'>
                        Recent Chats
                     </h3>
                    {filteredChats.map((item)=>{                                                
                        return(
                        <ChatItem  
                        key={`item${item.id}`}
                        name={item.name}
                        lastMessage={item.lastMessage}
                        time={item.time}
                        onClick={()=>handleChatClick(item)}
                        isActive={String(selectedChat?.id) === String(item.id)}
                        unread={item.unread}
                        isTyping={String(typingChatId) === String(item.id)}
                        />
                    )})}
                    </section>
            </div>
            <div className='mt-auto border-t border-gray-800 p-4'>
                <button
                  onClick={handleLogout}
                  className='w-full rounded-lg bg-red-600 py-3 text-white font-medium transition hover:bg-red-700'
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    )
    }

    export default Sidebar