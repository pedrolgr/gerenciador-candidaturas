import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './routes/public/Signup/Signup'
import { Signin } from './routes/public/Signin/Signin'
import { JobDashboard } from './routes/private/JobDashboard/JobDashboard'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './routes/PrivateRoute'
import { PublicRoute } from './routes/PublicRoute'
import { Toaster } from './components/ui/sonner'

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/signup",
        Component: Signup
      },
      {
        path: "/signin",
        Component: Signin
      }
    ]
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/jobdashboard",
        Component: JobDashboard,
      }
    ]
  }
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  )
}

export default App
