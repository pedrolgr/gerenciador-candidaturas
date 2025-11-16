import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './routes/public/Signup/Signup'
import { Signin } from './routes/public/Signin/Signin'
import { JobDashboard } from './routes/private/JobDashboard/JobDashboard'

let router = createBrowserRouter([
  {
    path: "/signup",
    Component: Signup
  },
  {
    path: "/signin",
    Component: Signin
  },
  {
    path: "/jobdashboard",
    Component: JobDashboard,
  }
])

function App() {

  return <RouterProvider router={router} />
}

export default App
