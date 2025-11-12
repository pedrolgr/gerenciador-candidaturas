import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './routes/public/Signup/Signup'

let router = createBrowserRouter([
  {
    path:"/signup",
    Component: Signup
  }
])

function App() {

  return <RouterProvider router={router} />
}

export default App
