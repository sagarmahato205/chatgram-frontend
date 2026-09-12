import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
    const connectSocket = () => {
        const token = localStorage.getItem("chatgram_token");

        if (!token) {
            setSocket(null);
            return null;
        }

        const newSocket = io("https://chatgram-backend-xcxx.onrender.com", {
            auth: {
                token,
            },
        });

        setSocket(newSocket);

        return newSocket;
    };

    let currentSocket = connectSocket();

    const handleLogin = () => {
        if (currentSocket) {
            currentSocket.disconnect();
        }

        currentSocket = connectSocket();
    };

    const handleLogout = () => {
        if (currentSocket) {
            currentSocket.disconnect();
            currentSocket = null;
        }

        setSocket(null);
    };  

    window.addEventListener("chatgram_login", handleLogin);
    window.addEventListener("chatgram_logout", handleLogout);

    return () => {
        window.removeEventListener("chatgram_login", handleLogin);

        if (currentSocket) {
            currentSocket.disconnect();
        }

        setSocket(null);
    };
}, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};

export default SocketContext;