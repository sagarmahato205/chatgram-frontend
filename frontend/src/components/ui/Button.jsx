import React from 'react'

function Button({children ,type="submit",onClick,className=""}) {
  return (
    <button 
    type={type}
    onClick={onClick}
    className={`w-full rounded-lg bg-blue-600 px-3 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:px-4 sm:text-base ${className}`}>
        {children}
    </button>
  )
}

export default Button