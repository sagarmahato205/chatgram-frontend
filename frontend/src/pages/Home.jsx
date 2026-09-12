    import React, {useEffect ,useState } from 'react'
    import Sidebar from '../components/layout/Sidebar'
    import ChatArea from "../components/layout/ChatArea"
    import RightPanel from "../components/layout/RightPanel"
    import SplashScreen from '../components/common/SplashScreen'
    import { useSocket } from '../context/SocketContext';

    function Home() {

      const currentUser = JSON.parse(
        localStorage.getItem("chatgram_current_user")
      );
      const socket = useSocket();

      const [chats, setChats] = useState([]);
      const [selectedChat , setSelectedChat] = useState(null);
      const [friends, setFriends] = useState([]);
      const [friendRequests, setFriendRequests] = useState([]);
      const [messages, setMessages] = useState({});
      const [typingChatId , setTypingChatId] = useState(null);
      const [loading , setLoading] = useState(true);  
      const [userStatus , setUserStatus] = useState({});
      const [unreadCount, setUnreadCount] = useState(0);

      

      useEffect(() => {
          setChats((prevChats) => {
              return friends.map((friend) => {
                  const existingChat = prevChats.find(
                      (chat) =>
                          String(chat.id) === String(friend.id)
                  );

                  return {
                      id: friend.id,
                      name: friend.name,
                      lastMessage: existingChat?.lastMessage || "Start Chatting...",
                      time: existingChat?.time || "Now",
                      unread: existingChat?.unread || 0,
                  };
              });
          });
      }, [friends]);

      useEffect(() => {
        if (!socket) return;

        const handleUserOnline = ({ userId }) => {
          setUserStatus((prev) => ({
            ...prev,
            [userId]: {
              online: true,
              lastSeen: null,
            },
          }));
        };

        const handleUserOffline = ({ userId }) => {
          setUserStatus((prev) => ({
            ...prev,
            [userId]: {
              online: false,
              lastSeen: new Date(),
            },
          }));
        };

        socket.on("user_online", handleUserOnline);
        socket.on("user_offline", handleUserOffline);

        return () => {
          socket.off("user_online", handleUserOnline);
          socket.off("user_offline", handleUserOffline);
        };
      }, [socket]);

      useEffect(() => {
        if (!socket) return;

        const handleUserTyping = ({ userId }) => {
          setTypingChatId(String(userId));
        };

        const handleUserStopTyping = ({ userId }) => {
          setTypingChatId((prev) =>
            String(prev) === String(userId) ? null : prev
          );
        };

        socket.on("user_typing", handleUserTyping);
        socket.on("user_stop_typing", handleUserStopTyping);

        return () => {
          socket.off("user_typing", handleUserTyping);
          socket.off("user_stop_typing", handleUserStopTyping);
        };
      }, [socket]);
      

      useEffect(() => {
        const fetchUnreadCount = async () => {
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
              console.log("Unread count error:", data);
              return;
            }

            console.log("Unread messages:", data.unreadCount);

            setUnreadCount(
              data.unreadMessages?.reduce(
                (total,item)=> total + item.unreadCount,
                0
              ) || 0
            );
          } catch (error) {
            console.error("Unread count API error:", error);
          }
        };

        fetchUnreadCount();
      }, []);

      useEffect(()=>{
        const timer = setTimeout(()=>{
          setLoading(false);
        },2000);
        return ()=>clearTimeout(timer);
      },[]);
      
      if(loading){
        return <SplashScreen />
      }
      
      return (
        <div className='h-screen flex bg-gray-950 text-white overflow-hidden'>
          <Sidebar
            chats={chats}
            setChats={setChats}
            selectedChat={selectedChat}
            unreadCount={unreadCount}
            setSelectedChat={setSelectedChat}
            friends = {friends}
            setFriends={setFriends}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
            typingChatId={typingChatId}
            setTypingChatId={setTypingChatId}
            userStatus={userStatus}
          />
          <ChatArea 
            chats={chats}
            setChats={setChats}
            selectedChat={selectedChat} 
            messages={messages}
            setMessages={setMessages}
            typingChatId={typingChatId}
            setTypingChatId={setTypingChatId}
            userStatus={userStatus}
          />
          <RightPanel 
            selectedChat={selectedChat}
            userStatus={userStatus}
          />
        </div>
      )
    }

    export default Home