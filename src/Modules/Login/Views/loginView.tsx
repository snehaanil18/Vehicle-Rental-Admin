"use client";
import React from 'react'
import AdminLogin from '../Components/userLogin'
import { useRouter } from 'next/navigation';

function Login() {
    const router = useRouter();
    const token = sessionStorage.getItem('token')
    if(token){
      router.push('/dashboard')
    }
  return (
    <div>
        <AdminLogin/>
    </div>
  )
}

export default Login