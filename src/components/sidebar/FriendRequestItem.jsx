import React from 'react'

function FriendRequestItem({
    name,
    onAccept,
    onReject,
}) {
  return (
    <div className='flex items-center justify-between rounded-xl p-3 hover:bg-gray-800 transition'>
        <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 font-semibold text-white'>
                {name.charAt(0)}
            </div>

            <h3 className='font-semibold text-white'>
                {name}
            </h3>
        </div>
        <div className='flex gap-2'>
            <button 
              onClick={onAccept}
              className='rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700'
            >
                Accept
            </button>
            <button 
              onClick={onReject}
              className='rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700'
            >
                Reject
            </button>
        </div>
    </div>
  )
}

export default FriendRequestItem