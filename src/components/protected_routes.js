import React from 'react'
import { useAuth } from '../context/auth_context'
import { Navigate } from 'react-router-dom'


const ProtectedRoutes = ({ children }) => {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to='/445bde24-bbb1-47a9-82aa-c4c3fd956c14-signin' />
    }
    return children
}

export default ProtectedRoutes;
