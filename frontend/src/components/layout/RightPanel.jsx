import React from 'react'

function RightPanel({
    selectedChat,
    userStatus
}) {
  return (
    <div className='w-72 border-l border-gray-800 bg-gray-900'>
        <div className='flex flex-col items-center border-b border-gray-800 p-6'>
            <div className='flex w-24 h-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold'>
                {selectedChat?.name?.charAt(0) || "?"}
            </div>
            <h2 className='mt-4 text-xl font-semibold text-white'>
                {selectedChat?.name || "Select a Chat"}
            </h2>
            <p className='text-sm text-green-400'>
                {!selectedChat
                    ? "Select a Chat"
                    : userStatus[selectedChat.id]?.online
                    ? "Online"
                    : userStatus[selectedChat.id]?.lastSeen
                    ? `Last seen ${new Date(
                        userStatus[selectedChat.id].lastSeen
                    ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}`
                    : "Offline"
                }
            </p>
        </div>

        <div className='border-b border-gray-800 p-5'>
            <h3 className='mb-4 text-lg font-semibold  text-white'>
                Shared Media
            </h3>

            <div className='space-y-3'>
                <div className='rounded-lg bg-gray-800 p-3 hover:bg-gray-700 transition'>
                    📄 Resume.pdf
                </div>
                <div className='rounded-lg bg-gray-800 p-3 hover:bg-gray-700 transition'>
                    📄 Notes.docx
                </div>
                <div className='rounded-lg bg-gray-800 p-3 hover:bg-gray-700 transition'>
                    📄 Project.zip
                </div>
            </div>
        </div>
    </div>
  )
}

export default RightPanel