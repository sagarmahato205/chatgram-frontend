    import React, {useEffect ,useState } from 'react'
    import Sidebar from '../components/layout/Sidebar'
    import ChatArea from "../components/layout/ChatArea"
    import RightPanel from "../components/layout/RightPanel"
    import SplashScreen from '../components/common/SplashScreen'

    function Home() {

      const currentUser = JSON.parse(
        localStorage.getItem("chatgram_current_user")
      );

      const [chats , setChats] = useState(()=>{
        const allChats = JSON.parse(
          localStorage.getItem("chatgram_chats")
        ) || {};
        return currentUser
           ?allChats[currentUser.id] || []
           :[];
      });

      useEffect(()=>{
         const allChats = JSON.parse(
          localStorage.getItem("chatgram_chats")
         ) || {};
         allChats[currentUser.id] = chats;
         localStorage.setItem(
          "chatgram_chats",
          JSON.stringify(allChats)
         );
      },[chats,currentUser]);

      const [selectedChat , setSelectedChat] = useState(null);

      const [friends,setFriends] = useState(()=>{
        const allFriends = JSON.parse(
          localStorage.getItem("chatgram_friends")
        ) || {};
        return allFriends[currentUser.id] || [];
      });

      const [friendRequests,setFriendRequests] = useState(()=>{
        const currentUser = JSON.parse(
          localStorage.getItem("chatgram_current_user")
        );
        const allRequests = JSON.parse(
          localStorage.getItem("chatgram_friend_requests")
        ) || {};
        return allRequests[currentUser.id] || [];
      });
      const [messages , setMessages] = useState(()=>{
        const savedMessages = localStorage.getItem("chatgram_messages");
        return savedMessages 
           ? JSON.parse(savedMessages)
           :{};
      });

      useEffect(()=>{
        localStorage.setItem(
          "chatgram_messages",
          JSON.stringify(messages)
        );
      },[messages]);

      useEffect(()=>{
        const allFriends = JSON.parse(
          localStorage.getItem("chatgram_friends")
        ) || {};
        allFriends[currentUser.id] = friends;
        localStorage.setItem(
          "chatgram_friends",
          JSON.stringify(allFriends)
        );
      },[friends,currentUser]);

      useEffect(()=>{
        const currentUser = JSON.parse(
          localStorage.getItem("chatgram_current_user")
        );
        const allRequests = JSON.parse(
          localStorage.getItem("chatgram_friend_requests")
        ) || {};
        allRequests[currentUser.id] = friendRequests;
        localStorage.setItem(
          "chatgram_friend_requests",
          JSON.stringify(allRequests)
        );
      },[friendRequests]);

      const [typingChatId , setTypingChatId] = useState(null);
      useEffect(()=>{
        const interval = setInterval(() => {
          const allTyping =
              JSON.parse(localStorage.getItem("chatgram_typing")) || {};
            const typingUserId = selectedChat?.id;
            if(typingUserId && allTyping[typingUserId] === currentUser.id){
              setTypingChatId(typingUserId);
            }else{
              setTypingChatId(null)
            }
        }, 300);
        return ()=> clearInterval(interval);
      },[selectedChat , currentUser]);
      const [userStatus , setUserStatus] = useState({});
      useEffect(()=>{
        const interval = setInterval(()=>{
          const status = 
              JSON.parse(localStorage.getItem("chatgram_status")) || {};
          setUserStatus(status);
        },300);
        return ()=> clearInterval(interval);
      },[]);

      const [loading , setLoading] = useState(true);  

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
            setSelectedChat={setSelectedChat}
            friends = {friends}
            setFriends={setFriends}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
            typingChatId={typingChatId}
            setTypingChatId={setTypingChatId}
           
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
          <RightPanel selectedChat={selectedChat}/>
        </div>
      )
    }

    export default Home