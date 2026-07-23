    import React, { useState } from 'react'
    import ChatItem from '../sidebar/ChatItem'
    import FriendRequestItem from '../sidebar/FriendRequestItem'
    import FriendItem from '../sidebar/FriendItem'
import { useNavigate } from 'react-router-dom'

    function Sidebar({
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        friends,
        setFriends,
        setFriendRequests,
        friendRequests,
        typingChatId,
        setTypingChatId,
    }){
        const navigate = useNavigate();
        const [search , setSearch] = useState("");
        const users = JSON.parse(
            localStorage.getItem("chatgram_users")
        ) || [];

        function handleAccept(request){
            const currentUser = JSON.parse(
                localStorage.getItem("chatgram_current_user")
            );
            const allFriends = JSON.parse(
                localStorage.getItem("chatgram_friends")
            ) || {};
            const newFriend = {
                ...request,
                isOnline: false,
            };
            const currentUserFriends = allFriends[currentUser.id] || [];
            allFriends[currentUser.id]=[
                ...currentUserFriends,
                newFriend,
            ];
            const senderFriends = allFriends[request.id] || [];
            const currentUserData = {
                id:currentUser.id,
                name:currentUser.name,
                email:currentUser.email,
                isOnline:false,
            };
            allFriends[request.id] = [
                ...senderFriends,
                currentUserData,
            ];
            localStorage.setItem(
                "chatgram_friends",
                JSON.stringify(allFriends)
            );
            setFriends((prevFriends)=>{
                return[
                    ...prevFriends,
                    newFriend,
                ];
            });
             setFriendRequests((prevRequest)=>{
                return prevRequest.filter((item)=>{
                    return item.id !== request.id;
                });
            });
            const allChats = JSON.parse(
                localStorage.getItem("chatgram_chats")
            ) || {};
            const currentUserChats = allChats[currentUser.id] || [];
            const alreadyExisting = currentUserChats.some(
                (chat)=>chat.id === request.id
            );
            if(!alreadyExisting){
                currentUserChats.push({
                    id:request.id,
                    name:request.name,
                    lastMessage:"Start Chatting",
                    time:"Now",
                    unread:0,
                });
            }
            allChats[currentUser.id] = currentUserChats;
            const senderChats = allChats[request.id] || [];
            const senderAlreadyExists = senderChats.some(
                (chat)=> chat.id === currentUser.id
            );
            if(!senderAlreadyExists){
                senderChats.push({
                    id:currentUser.id,
                    name:currentUser.name,
                    lastMessage:"Start Chatting",
                    time:"Now",
                    unread:0,
                })
            }
            allChats[request.id] = senderChats;
            localStorage.setItem(
                "chatgram_chats",
                JSON.stringify(allChats)
            );
        }

        function handleReject(id){
           setFriendRequests((prevRequest)=>{
            return prevRequest.filter((item)=>{
                return item.id !== id;
            })
           })
        }
 
        function handleSendRequest(user){
            const allRequests = JSON.parse(
                localStorage.getItem("chatgram_friend_requests")
            ) || {};
            const recieverRequests = allRequests[user.id] || [];
            const currentUser = JSON.parse(
                localStorage.getItem("chatgram_current_user")
            );
            const alreadyRequested = recieverRequests.some(
                (request)=>request.id === currentUser.id
            );
            if(alreadyRequested){
                alert("Friend Request already Sent.")
                return;
            }
            recieverRequests.push({
                id:currentUser.id,
                name:currentUser.name,
                email:currentUser.email,
            });
            allRequests[user.id] = recieverRequests;
            localStorage.setItem(
                "chatgram_friend_requests",
                JSON.stringify(allRequests)
            );
            alert("Friend Request sent.");
            setSearch("");
        }
        function handleFriendClick(friend){
            const existingChat = chats.find((chat)=>{
                return chat.name === friend.name;
            })

            if(existingChat){
                setSelectedChat(existingChat);
            }else{
                const newChat = {
                    id:friend.id,
                    name:friend.name,
                    lastMessage:"Start Chatting...",
                    time:"Now",
                }
                setChats((prevChat)=>{
                    return[
                        ...prevChat,
                        newChat,
                    ]
                });
                setSelectedChat(newChat)
            }
        }

        const filteredChats = chats.filter((chat)=>{
            return chat.name.toLowerCase().includes(search.toLowerCase());            
        });

        const currentUser = JSON.parse(
            localStorage.getItem("chatgram_current_user")
        );
        const filteredUsers = users.filter((user)=>{
            return(
                user.name.toLowerCase().includes(search.toLowerCase()) &&   
                user.id !== currentUser.id &&
                !friends.some((friend)=>friend.id === user.id)
            );
        });

        function handleChatClick(chat){
            setSelectedChat(chat);

            setChats((prevChats)=>{
                return prevChats.map((item)=>{
                    if(item.id === chat.id){
                        return{
                            ...item,
                            unread:0,
                        };
                    }
                    return item;
                })
            })
        }
        function handleLogout(){
            localStorage.removeItem("chatgram_current_user");
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
                <button className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-xl hover:bg-gray-700 transition'>
                    😊
                </button>
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
                    filteredUsers.map((user)=>(
                        <div
                          key={user.id}
                          className='mb-2 flex items-center justify-between rounded-lg bg-gray-800 p-3  '
                        >
                            <div>
                                <p className='font-medium text-white '>{user.name}</p>
                                <p className='text-xs text-gray-400'>
                                    {user.isOnline?"Online":"Offline"}
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
                                isOnline={friend.isOnline}
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
                        isActive={selectedChat?.id === item.id}
                        unread={item.unread}
                        isTyping={typingChatId === item.id}
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