import React from 'react'

function SplashScreen() {
  return (
    <div className='h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white'>
        <div className='h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-5xl animate-pulse shadow-2xl shadow-blue-500/50'>
            💬
        </div>
        <h1 className='mt-6 text-4xl font-extrabold tracking-wider animate-pulse'>
            ChatGram
        </h1>
        <div className='mt-5 flex justify-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-blue-500 animate-bounce'></div>
            <div className='h-3 w-3 rounded-full bg-blue-500 animate-bounce delay-100'></div>
            <div className='h-3 w-3 rounded-full bg-blue-500 animate-bounce delay-200'></div>
        </div>
        <p className='mt-8 text-xs tracking-widest text-gray-500'>
            Secure Messaging
        </p>
    </div>
  );
}

export default SplashScreen;