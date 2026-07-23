  import React,{useState} from 'react'
  import Input from './Input';

  function PasswordInput({
      label,
      placeholder,
      value,
      onChange,
      name,
  }) {
      const [showPassword , setShowPassword] = useState(false);
      function handleShow(){
          setShowPassword(prev=> !prev);
      }
    return (
      <>
      <Input 
        label={label}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={showPassword ? "text":"password"}
        rightElement={
          <button type='button'
          onClick={handleShow}
          className='text-sm font-medium text-blue-400 hover:text-blue-300'
          >{showPassword?"Hide":"Show"}</button>  
        }
      />
      </>
    )
  }

  export default PasswordInput