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
              className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 pr-16 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition placeholder-gray-400' 
            />
            <div className='absolute right-3 top-1/2 -translate-y-1/2'>
              {rightElement}
            </div>
          </div>
      </div>
    )
  }

  export default Input