import { useSelector } from "react-redux"
import React from 'react'
import { Outlet, Navigate } from "react-router-dom"

const PrivateRoute = () => {

  const {currentUser} = useSelector(state => state.user)

  return currentUser ? <Outlet /> : <Navigate to={'/login'} />
}

export default PrivateRoute