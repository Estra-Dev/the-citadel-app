import { useSelector } from "react-redux"
import React from 'react'
import { Outlet, Navigate } from "react-router-dom"

const OnlyAdminPrivateRoute = () => {

  const {currentUser} = useSelector(state => state.user)

  return currentUser && (currentUser.isAdmin || currentUser.rest.isAdmin) ? <Outlet /> : <Navigate to={'/login'} />
}

export default OnlyAdminPrivateRoute