import React from 'react'

function ChatItem({
    name,
    lastMessage,
    time,
    onClick,
    isActive,
    unread,
    isTyping,
}) {
  return (
   <div 
   onClick={onClick}
   className={`flex min-w-0 items-center justify-between gap-2 rounded-xl p-3 cursor-pointer transition ${
    isActive
       ?"bg-blue-600/20 border-l-4 border-blue-500" 
       :"hover:bg-gray-800"
   }`}>
    <div className='flex min-w-0 items-center gap-3'>
        <div className={`flex items-center justify-center h-12 w-12 rounded-full font-semibold text-white
        ${ 
         isActive 
           ? "bg-blue-500"
           : "bg-gray-700"
        }
        `}>
            {name.charAt(0)}
        </div>
        <div className='min-w-0 flex-1'>
            <h3 className='truncate font-semibold text-white'>
                {name}
            </h3>
            <p className={`min-w-0 max-w-[180px] truncate text-sm text-gray-400 sm:w-40 ${
                isTyping? "text-blue-400 italic": "text-gray-400"
            }`}>
                {isTyping?"Typing...":lastMessage}
            </p>
        </div>
    </div>
    <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xs text-gray-500">
            {time}
        </span>

        {unread > 0 && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                {unread}
            </div>
        )}

    </div>
   </div>
  )
}

export default ChatItem