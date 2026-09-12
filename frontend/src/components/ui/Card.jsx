import React from 'react'

function Card({children,className=""}) {
  return (
    <div className={`w-full max-w-md rounded-2xl bg-gray-800/80 border border-white/10 p-8 shadow-2xl backdrop-blur-md ${className }`}>
        {children}
    </div>
  );
}

export default Card