import React,{useEffect,useRef, useState} from 'react'
import MessageBubble from '../chat/MessageBubble'

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
    
    const currentUser = JSON.parse(
        localStorage.getItem("chatgram_current_user")
    );
    const chatMessages = 
       selectedChat && currentUser
            ?messages[currentUser.id]?.[selectedChat.id] || []
            : [];

    function updateChatList(lastMessage){

        setChats((prevChats)=>{

            const currentChat = prevChats.find(
                (chat)=> chat.id === selectedChat.id
            );
            
            if (!currentChat) return prevChats;

            const updatedChat = {
                ...currentChat,
                lastMessage:lastMessage,
                time:"Now",
            };


            const remainingChats = prevChats.filter(
                (chat)=> chat.id !== selectedChat.id
            );


            return [
                updatedChat,
                ...remainingChats
            ];

        });
    }


    function handleSend(){
        const currentUser = JSON.parse(
            localStorage.getItem("chatgram_current_user")
        );
        const receiver = selectedChat;
        const allStatus = 
            JSON.parse(localStorage.getItem("chatgram_status")) || {};
        allStatus[currentUser.id] = {
            online:true,
            lastseen :null,
        };
        localStorage.setItem(
            "chatgram_status",
            JSON.stringify(allStatus)
        );

        if(!selectedChat) return;

        if(input.trim()==="")return;

        if(editingId){
            setMessages((prevMessages)=>({
                ...prevMessages,
                [currentUser.id]:{
                    ...prevMessages[currentUser.id],
                    [selectedChat.id]:
                       prevMessages[currentUser.id][selectedChat.id].map((msg)=>{
                        if(msg.id===editingId){
                            return{
                                ...msg,
                                text:input,
                                edited:true,
                            };
                        }
                        return msg;
                       })
                },
            }));
            updateChatList(input);
            setEditingId(null);
            setEditingText("");
            setInput("");

            return;
        }

        const newMessage ={
            id:Date.now(),
            text:input,
            sender:'me',
            status:"sent",
            time: new Date().toLocaleTimeString([],{
                hour:"2-digit",
                minute:"2-digit",
            }),
            edited:false,
            replyTo: replyMessage,
            reaction:null,
        }

        const allMessages = JSON.parse(
            localStorage.getItem("chatgram_messages")
        ) || {};

        if(!allMessages[currentUser.id]){
            allMessages[currentUser.id]={};
        }
        if(!allMessages[receiver.id]){
            allMessages[receiver.id] = {};
        }

        if(!allMessages[currentUser.id][receiver.id]){
            allMessages[currentUser.id][receiver.id]=[];
        }
        if(!allMessages[receiver.id][currentUser.id]){
            allMessages[receiver.id][currentUser.id]=[];
        }
        const senderMessage = {
            ...newMessage,
            status:"delivered",
        }
        const receiverMessage = {
            ...newMessage,
            sender:"other",
            status:"delivered",
        }
        allMessages[currentUser.id][receiver.id].push(senderMessage);
        allMessages[receiver.id][currentUser.id].push(receiverMessage);
        localStorage.setItem(
            "chatgram_messages",
            JSON.stringify(allMessages)
        );
        setMessages(allMessages);
        const messageId = newMessage.id;
        // setTimeout(()=>{
        //     setMessages((prevMessages)=>({
        //         ...prevMessages,
        //         [selectedChat.id]:prevMessages[selectedChat.id].map((msg)=>{
        //             if(msg.id === messageId){
        //                 return{
        //                     ...msg,
        //                     status:"delivered",
        //                 };
        //             }
        //             return msg;
        //         })
        //     }))
        // },1000)
        // setTimeout(()=>{
        //     setMessages((prevMessages)=>({
        //         ...prevMessages,
        //         [selectedChat.id]:prevMessages[selectedChat.id].map((msg)=>{
        //             if(msg.id === messageId){
        //                 return{
        //                     ...msg,
        //                     status:"seen",
        //                 };
        //             }
        //             return msg;
        //         })
        //     }))
        // },2000);

        updateChatList(input); 

        setInput("")
        setReplyMessage(null);
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

    useEffect(()=>{
        if(!selectedChat ||  !currentUser) return;
        const allMessages = JSON.parse(
            localStorage.getItem("chatgram_messages")
        ) || {};

        const conversation = 
           allMessages[currentUser.id]?.[selectedChat.id] || [];

        let updated = false;

        conversation.forEach((msg)=>{
            if(msg.sender === "other" && msg.status !== "seen"){
                msg.status="seen";
                updated= true;
            }
        });
        const senderConversation = 
            allMessages[selectedChat.id]?.[currentUser.id] || [];

        senderConversation.forEach((msg)=>{
            if(msg.sender === "me" && msg.status !== "seen"){
                msg.status ='seen';
                updated = true;
            }
        })
        if(updated){
            localStorage.setItem(
                "chatgram_messages",
                JSON.stringify(allMessages)
            );
            setMessages({...allMessages});
        }
    },[selectedChat]);

    function handleDelete(messageId){
        setMessages((prevMessages)=>({
            ...prevMessages,
            [currentUser.id]:{
                ...prevMessages[currentUser.id][selectedChat.id].filter(
                    (message)=> message.id !== messageId
                )
            }
        }));    
    }
    function handleEdit(message){
        setEditingId(message.id);
        setEditingText(message.text);
        setInput(message.text);
    }
    function handleReply(message){
        setReplyMessage(message);
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
                           ?"No Chats Selected"
                           :typingChatId === selectedChat.id
                           ?"Typing..."
                           :userStatus[selectedChat?.id]?.online
                               ?"online"
                           :"Offline"
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
                  onChange={(e)=>{
                    setInput(e.target.value);
                    if(!selectedChat) return;
                    const allTyping =
                        JSON.parse(localStorage.getItem("chatgram_typing")) || {};
                    allTyping[currentUser.id] = selectedChat.id;
                    localStorage.setItem(
                        "chatgram_typing",
                        JSON.stringify(allTyping)
                    );
                    setTypingChatId(selectedChat.id);
                    clearTimeout(window.typingTimeout);
                    window.typingTimeout = setTimeout(()=>{
                        const typing=
                           JSON.parse(localStorage.getItem("chatgram_typing")) || {};
                        delete typing[currentUser.id];
                        localStorage.setItem(
                            "chatgram_typing",
                            JSON.stringify(typing)
                        );
                        setTypingChatId(null);
                    },1000);    
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