import React from 'react'
import { Navigate } from 'react-router-dom'

const UserRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  if (role === "0") {
    return children
  }
  if (role === "1") {  
    return <Navigate to='/admin/dashboard' replace />
  }
  return <Navigate to='/login' replace />
}

export default UserRoute