  import React from 'react'

  function Input({
      name,
      label,
      type="text",
      placeholder,
      value,
      onChange,
      rightElement
  }) {
    return (
      <div className='mb-4'>
          <label className='mb-2 block text-sm font-medium text-gray-300'>
              {label}
          </label>
          <div className='relative'>
            <input type={type}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className='w-full min-w-0 rounded-lg border border-gray-600 bg-gray-700 px-3 pr-14 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition placeholder-gray-400 sm:px-4 sm:pr-16 sm:text-base'
            />
            <div className='absolute right-3 top-1/2 -translate-y-1/2'>
              {rightElement}
            </div>
          </div>
      </div>
    )
  }

  export default Input