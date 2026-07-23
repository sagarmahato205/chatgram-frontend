import React, { useState } from 'react'
import Input from '../../components/ui/Input'
import PasswordInput from '../../components/ui/PasswordInput'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Link, useNavigate } from 'react-router-dom'
import AuthHeader from './AuthHeader'

function Login() {
  const navigate = useNavigate();
  const [formData , setFormData] = useState({
    email:"",
    password:"",
  });
  const [error,setError] = useState("");
  function handleChange(e){
    const {name , value} = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]:value,
    }));
  }
  function handleSubmit(e){
    e.preventDefault();
    setError("");
    if(!formData.email.trim()){
      setError("Email is Required");
      return;
    }
    if(!formData.password){
      setError("Password is required");
      return;
    }
    const users = JSON.parse(
      localStorage.getItem("chatgram_users")
    ) || [];
    const loggedInUser = users.find((user)=>{
      return(
        user.email === formData.email &&
        user.password === formData.password
      );
    });
    if(!loggedInUser){
      setError("Invalid Email and Password");
      return;
    }
    localStorage.setItem(
      "chatgram_current_user",
      JSON.stringify(loggedInUser)
    );
    navigate("/")
  }

  return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-700'>
         <Card>
            <AuthHeader
              title="Welcome Back"
              subTitle="Please sign in to continue."
            />
            <form onSubmit={handleSubmit}>
              <Input 
                label="Email"
                type='email'
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter your email'
              />
              <PasswordInput 
                label="Password"
                type='password'
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <Button type='submit'>Login</Button>
              <p className='mt-3 text-sm text-white hover:text-blue-400 cursor-pointer hover:underline text-right'>
                Forgot Password?
              </p>
              <p className='text-center text-white hover:underline'>
                Don't have an account? <span className='text-blue-400 cursor-pointer'>
                  <Link to='/signup'>Sign Up</Link></span>
              </p>
            </form>
         </Card>
      </div> 
  )
}

export default Login