import React from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRoutes({children}) {
    const token = localStorage.getItem("chatgram_token");
    const currentUser = JSON.parse(
        localStorage.getItem("chatgram_current_user")
    );
    if(!token || !currentUser){
        return <Navigate to="/login" replace/>
    }
  return children
}

export default ProtectedRoutes