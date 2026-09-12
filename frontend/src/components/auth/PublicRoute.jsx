import React from 'react'
import { Navigate } from 'react-router-dom';

function PublicRoute({children}) {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(
        localStorage.getItem("chatgram_current_user")
    );
    if(token && currentUser){
        return <Navigate to="/" replace/>
    }
  return children;
}

export default PublicRoute