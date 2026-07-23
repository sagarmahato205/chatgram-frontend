    import React from 'react'

    function FriendItem({
        name,
        isOnline, 
        onClick,
    }) {
    return (
        <div onClick={onClick}
        className='flex items-center justify-between rounded-xl p-3 cursor-pointer hover:bg-gray-800  transition ' 
        >
            <div className='flex items-center gap-3'>
                <div className='relative'>
                    <div className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 font-semibold text-white'>
                        {name.charAt(0)}
                    </div>

                    {isOnline && (
                        <div className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500'></div>
                    )}
                </div>

                <div>
                    <h3 className='font-semibold text-white'>
                        {name}
                    </h3>
                    <p className='text-xs text-gray-400'>
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
        </div>
    )
    }

    export default FriendItem