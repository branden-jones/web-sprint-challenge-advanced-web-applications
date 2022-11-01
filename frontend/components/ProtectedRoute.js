import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = (props) => {
    return (
        localStorage.getItem('token') ? props.children : <Navigate to='/' />
    )
}