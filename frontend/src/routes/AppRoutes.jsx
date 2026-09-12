import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Home from "../pages/Home"
import Login from "../pages/Auth/Login"
import NotFound from '../pages/NotFound'
import Signup from '../pages/Auth/Signup'
import ProtectedRoutes from '../components/auth/ProtectedRoutes'
import PublicRoute from '../components/auth/PublicRoute'

function AppRoutes() {
  return (
    <Routes>
        <Route 
            path='/' 
            element={
               <ProtectedRoutes>
                <Home />
               </ProtectedRoutes>
            }
        />
        <Route 
          path='/login' 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route 
          path='/signup' 
          element={
             <PublicRoute>
              <Signup />
             </PublicRoute>
          }
        />
        <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default AppRoutes;