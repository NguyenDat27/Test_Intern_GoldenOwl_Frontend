import React from 'react'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  if (role === "1") {
    return children
  }
  if (role === "0") {
    return <Navigate to='/user/home' replace />
  }
  return <Navigate to='/login' replace />
}

export default AdminRoute