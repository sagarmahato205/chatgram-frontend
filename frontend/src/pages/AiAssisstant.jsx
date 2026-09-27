import {useState,useEffect,useRef} from "react";
import axios from "axios";

const AIAssistant = ()=>{
    const [prompt,setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);
    useEffect(() => {
        const fetchAIHistory = async () => {
            try {
                const token = localStorage.getItem("chatgram_token");

                const res = await axios.get(
                    "https://chatgram-backend-xcxx.onrender.com/api/ai/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const history = [];

                res.data.messages.forEach((message) => {
                    history.push({
                        role: "user",
                        content: message.prompt,
                    });

                    history.push({
                        role: "ai",
                        content: message.response,
                    });
                });

                setMessages(history);

            } catch (error) {
                console.log("Failed to load AI history", error);
            }
        };

        fetchAIHistory();
    }, []);
    const handleSend = async ()=>{
        if(!prompt.trim() || loading) return;
        const userMessage = prompt.trim();
        setMessages((prev)=>[
            ...prev, 
            {
                role:"user",
                content:userMessage,
            },
        ]);
        setPrompt("");
        try{
            setLoading(true);
            const token = localStorage.getItem("chatgram_token");   
            const res = await axios.post(
                "https://chatgram-backend-xcxx.onrender.com/api/ai/chat",
                {
                    prompt:userMessage,
                },
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
            );
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: res.data.response,
                },
            ]);
        }catch(error){
            console.log(error);
            setMessages((prev)=>[
                ...prev,
                {
                    role:"ai",
                    content:"Something went wrong. Please try again.",
                },
            ]);
        }finally{
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return(
        <div className="h-screen bg-gray-950 text-white flex flex-col">
            <header className="h-16 border-b border-gray-800 flex items-center px-5 shrink-0">
                <div>
                    <h1 className="text-lg font-semibold">
                        AI Assistant
                    </h1>
                    <p className="text-xs text-gray-400">
                        Powered by Chatgram
                    </p>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={() => setMessages([])}
                        className="text-sm text-gray-400 hover:text-white transition"
                    >
                        Clear Chat
                    </button>
                )}
            </header>
            <main className="flex-1 overflow-y-auto px-4 py-6">
                {messages.length === 0 ?(
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                    ✨ 
                                </div>
                                <h2 className="text-2xl font-semibold mb-2"> 
                                    How can I help you?
                                </h2>

                                <p className="text-gray-400 text-sm"> 
                                    Ask me anything and I'll try to help. 
                                </p>
                            </div>
                        </div>
                    ):(
                        <div className="max-w-3xl mx-auto space-y-5">
                            {messages.map((message, index) => ( 
                                <div
                                    key={index} 
                                    className={`flex ${ 
                                        message.role === "user" 
                                            ? "justify-end" 
                                            : "justify-start" 
                                    }`} 
                                >
                                <div className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-wrap ${ 
                                    message.role === "user" 
                                        ? "bg-blue-600 rounded-br-md" 
                                        : "bg-gray-800 rounded-bl-md" 
                                    }`} 
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        {loading && ( 
                            <div className="flex justify-start"> 
                                <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md text-gray-400"> 
                                    AI is thinking... 
                                </div> 
                            </div> 
                        )}
                    </div>
                )}  
            </main>
            <div className="border-t border-gray-800 bg-gray-950 p-4 shrink-0">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-end gap-2 bg-gray-800 border border-gray-700 rounded-2xl px-3 py-2">
                        <textarea value={prompt} 
                            onChange={(e) => setPrompt(e.target.value)} 
                            onKeyDown={handleKeyDown} 
                            placeholder="Message AI Assistant..." 
                            rows="1" 
                            className="flex-1 bg-transparent outline-none resize-none px-2 py-2 text-sm placeholder-gray-500 max-h-32" 
                        />

                        <button 
                            onClick={handleSend} 
                            disabled={!prompt.trim() || loading} 
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 w-10 h-10 rounded-full flex items-center justify-center transition shrink-0" 
                        > 
                            ➤ 
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-2"> 
                        AI can make mistakes. Check important information. 
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;