import React, { useState } from 'react'
import Input from "../../components/ui/Input"
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Link, useNavigate } from 'react-router-dom'
import AuthHeader from './AuthHeader'
import PasswordInput from '../../components/ui/PasswordInput'

function Signup() {
  const navigate = useNavigate();

  const [formData , setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  });
  
  function handleChange(e){
    const {name , value} = e.target;  
    setFormData((prev)=>({
      ...prev,
      [name]:value, 
    }));
  }
  const [error , setError] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is Required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (!formData.confirmPassword) {
      setError("Confirm Password is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://chatgram-backend-xcxx.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      alert("Account Created Successfully!");
      navigate("/login");

    } catch (error) {
      console.error("Signup API error:", error);
      setError("Unable to connect to server");
    }
}

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-700'>
      <Card>
        <AuthHeader
         title="Create Account"
         subTitle="Create Your Chatgram account"
        />
        {
          error && (
            <p className='mb-3 rounded-lg bg-red-500/20 p-3 text-sm  text-red-400'>
              {error}
            </p>
          )
        }
        <form 
          className='space-y-4'
          onSubmit={handleSubmit}
        >
          <Input 
            label="Name"
            type='text'
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          <Input 
            label="Email"
            type='email'
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <PasswordInput 
            label="Password"  
            type='password'
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
          />
          <PasswordInput 
            label="Confirm Password"
            type='Password'
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          <Button 
            type='submit'  
          >
            Create Account
          </Button>
          <p className='text-white mt-2 hover:underline'>Already have an account? <Link to="/login" className='hover:text-blue-400'>Login</Link></p>
        </form>
      </Card>
    </div>
  )
}

export default Signup