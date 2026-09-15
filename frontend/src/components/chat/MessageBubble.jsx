import React from 'react'

function MessageBubble({
    text,
    isMe,
    type,
    mediaUrl,
    status,
    time,
    onDelete,
    onEdit,
    edited,
    onReply,
    replyTo,
    onReaction,
    reaction,
}) { 
  return (
    <div
    className={`mb-3 flex min-w-0 ${isMe ? "justify-end" : "justify-start"}`}>
        <div
          className={`min-w-0 max-w-[85%] sm:max-w-xs break-words overflow-hidden rounded-2xl px-3 sm:px-4 py-2 text-white ${
            isMe
                ?"bg-emerald-600 rounded-br-sm"
                :"bg-gray-700 rounded-bl-sm"
          }`}
        >
            {
              replyTo && (
                <div className='mb-2 min-w-0 max-w-full overflow-hidden rounded-lg border-l-4 border-gray-400 bg-black/20 px-3 py-2'>
                  <p className='text-xs font-semibold text-gray-200'>
                    {replyTo.sender === 'me'?'you':'reply'}
                  </p>
                  <p className='truncate text-xs text-gray-300'>
                    {replyTo.text}
                  </p>
                </div>
              )
            }
            {type === "image" && mediaUrl && (
                <img
                    src={mediaUrl}
                    alt="Shared image"
                    className="block w-full max-w-[220px] sm:max-w-[320px] rounded-lg object-cover"
                />
            )}

            {type === "video" && mediaUrl && (
                <video
                    src={mediaUrl}
                    controls
                    className="block w-full max-w-[220px] sm:max-w-[320px] rounded-lg"
                />
            )}

            {type === "text" && (
                <p className="min-w-0 whitespace-pre-wrap break-words">{text}</p>
            )}
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
            <div className='mt-2 flex flex-wrap gap-1'>
              {["❤️", "😂", "👍", "😢", "😯"].map((emoji)=>(
                <button
                 key={emoji}
                 onClick={()=>onReaction(emoji)}
                 className='text-sm hover:scale-125 transition'>
                  {emoji}
                </button>
              ))}
            </div>
            {
              reaction && (
                <div className='mt-1 text-sm'>
                  {reaction}
                </div>
              )
            }
            {
              <div className='mt-2 flex flex-wrap gap-2'>
                <button
                  onClick={onReply}
                  className='text-xs text-gray-300 hover:text-white transition'
                >
                  Reply
                </button>

                {isMe && (
                  <>
                    <button
                      onClick={onEdit}
                      className='text-xs text-yellow-300 hover:text-yellow-400'
                    >
                      Edit
                    </button>

                    <button
                      onClick={onDelete}
                      className='text-xs text-red-400 hover:text-red-600'
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            }
        </div>
    </div>
  )
}

export default MessageBubble