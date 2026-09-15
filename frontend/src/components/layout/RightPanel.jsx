import React from 'react'

function RightPanel({
    selectedChat,
    userStatus
}) {
  return (
    <div className='h-full min-w-0 w-72 shrink-0 overflow-y-auto border-l border-gray-800 bg-gray-900'>
        <div className='flex min-w-0 flex-col items-center border-b border-gray-800 p-5'>
            <div className='flex w-24 h-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold'>
                {selectedChat?.name?.charAt(0) || "?"}
            </div>
            <h2 className='mt-4 max-w-full truncate px-2 text-center text-xl font-semibold text-white'>
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

        <div className='min-w-0 border-b border-gray-800 p-4 sm:p-5'>
            <h3 className='mb-4 text-lg font-semibold  text-white'>
                Shared Media
            </h3>

            <div className='space-y-3'>
                <div className='min-w-0 truncate rounded-lg bg-gray-800 p-3 text-sm hover:bg-gray-700 transition'>
                    📄 Resume.pdf
                </div>
                <div className='min-w-0 truncate rounded-lg bg-gray-800 p-3 text-sm hover:bg-gray-700 transition'>
                    📄 Notes.docx
                </div>
                <div className='min-w-0 truncate rounded-lg bg-gray-800 p-3 text-sm hover:bg-gray-700 transition'>
                    📄 Project.zip
                </div>
            </div>
        </div>
    </div>
  )
}

export default RightPanel