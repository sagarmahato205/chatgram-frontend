import React from 'react'

function AuthHeader({title , subTitle}) {
  return (
    <>
      <div className='mb-4 text-center'>
        <div className='mx-auto  flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl shadow-lg shadow-blue-500/30 text-white font-bold'>
          CG
        </div>
        <h2 className='text-lg mb-2 font-semibold tracking-wide text-blue-400'>
          ChatGram
        </h2>
        <h1 className='text-4xl font-bold tracking-tight text-white'>{title}</h1>
        <p className='mt-2 text-sm leading-relaxed text-gray-400'>{subTitle}</p>
      </div>
    </>
  )
}

export default AuthHeader