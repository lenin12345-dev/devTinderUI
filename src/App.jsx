import { useState } from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Body from './Body.jsx'
import Login from '../src/components/Login.jsx'
import Profile from '../src/components/Profile.jsx'


function App() {
  
  return (
    <>
    <BrowserRouter basename='/'>
    <Routes>
      <Route path='/' element={<Body/>} >
      <Route path="/login" element={<Login/>}/>
      <Route path="/profile" element={<Profile/>}/>

      </Route>
    </Routes>
    </BrowserRouter>
    </>   
   

 
    
  )
}

export default App
