import React from 'react'

function SplashScreen() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 px-4 text-white'>
        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-4xl animate-pulse shadow-2xl shadow-blue-500/50 sm:h-24 sm:w-24 sm:text-5xl'>
            💬
        </div>
        <h1 className='mt-6 text-3xl font-extrabold tracking-wider animate-pulse sm:text-4xl'>
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