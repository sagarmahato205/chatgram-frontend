import React from 'react'
import { Navigate } from 'react-router-dom';

function PublicRoute({children}) {
    const currentUser = JSON.parse(
        localStorage.getItem("chatgram_current_user")
    );
    if(currentUser){
        return <Navigate to="/" replace/>
    }
  return children;
}

export default PublicRoute