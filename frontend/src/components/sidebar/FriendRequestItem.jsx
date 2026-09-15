import React from 'react'

function FriendRequestItem({
    name,
    onAccept,
    onReject,
}) {
  return (
    <div className='flex min-w-0 items-center justify-between gap-2 rounded-xl p-3 hover:bg-gray-800 transition'>
        <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-semibold text-white'>
                {name.charAt(0)}
            </div>

            <h3 className='truncate font-semibold text-white'>
                {name}
            </h3>
        </div>
        <div className='flex shrink-0 gap-1 sm:gap-2'>
            <button 
              onClick={onAccept}
              className='rounded-lg bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 sm:px-3 sm:text-sm'
            >
                Accept
            </button>
            <button 
              onClick={onReject}
              className='rounded-lg bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 sm:px-3 sm:text-sm'
            >
                Reject
            </button>
        </div>
    </div>
  )
}

export default FriendRequestItem