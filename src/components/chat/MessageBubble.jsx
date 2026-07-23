import React from 'react'

function MessageBubble({
    text,
    isMe,
    status,
    time,
    onDelete,
    onEdit,
    edited,
    onReply,
    replyTo,
}) { 
  return (
    <div
    className={`mb-3 flex ${isMe ? "justify-end":"justify-start"}`}>
        <div
          className={`max-w-xs rounded-2xl px-4 py-2 text-white ${
            isMe
                ?"bg-emerald-600 rounded-br-sm"
                :"bg-gray-700 rounded-bl-sm"
          }`}
        >
            {
              replyTo && (
                <div className='mb-2  rounded-lg border-l-4 border-gray-400 bg-black/20 px-3 py-2 '>
                  <p className='text-xs font-semibold text-gray-200'>
                    {replyTo.sender === 'me'?'you':'reply'}
                  </p>
                  <p className='truncate text-xs text-gray-300'>
                    {replyTo.text}
                  </p>
                </div>
              )
            }
            <p>{text}</p>
            <div className='mt-1 flex justify-end items-center gap-1 text-xs text-gray-300'>
              <span>{time}</span>
            
             {
              isMe && (
                <>
                  {status === "sent" && "✓"}
                  {status === "delivered" && "✓✓"}
                  {status === "seen" && (
                    <span className='text-sky-300 font-bold'>
                      ✓✓
                    </span>
                  )}
                </>
              )
             }
            </div>
            <p className='mt-1 text-[10px] text-gray-300'>
              {edited && "(edited)"}
            </p>
            {
              isMe && (
                <div className='mt-2 flex gap-2'> 
                  <button
                    onClick={onReply}
                    className='mt-2 text-xs text-gray-300 hover:text-white transition'
                  >
                    Reply
                  </button>
                  <button
                    onClick={onEdit}
                    className='mt-2 text-xs text-yellow-300 hover:text-yellow-400'
                  >
                    Edit
                  </button>
                  <button 
                    onClick={onDelete}
                    className='mt-2 text-xs text-red-400 hover:text-red-600'
                  >
                    🗑️ Delete
                  </button>
                </div>
              )
            }
        </div>
    </div>
  )
}

export default MessageBubble