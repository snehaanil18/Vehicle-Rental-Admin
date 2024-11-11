"use client";
import React, { useState } from 'react'
import InputField from '@/Utils/Components/InputField/InputField'
import styles from './login.module.css'
import { LOGIN_ADMIN_MUTATION } from '../Services/mutations';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

function AdminLogin() {
    const [userDetail, setUserDetail] = useState({ email: '', password: '' });
    const [adminLogin, { loading, error }] = useMutation(LOGIN_ADMIN_MUTATION);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await adminLogin({
                variables: userDetail,
            });

            if (response.data.adminLogin.success) {
                const token = response.data.adminLogin.token
                sessionStorage.setItem('token', token)
  
                // Show success alert
                Swal.fire({
                    title: 'Success!',
                    text: response.data.adminLogin.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                // Store or use the user details as needed
                router.push('/dashboard')

            }
            else {

                Swal.fire({
                    title: 'Error!',
                    text: response.data?.adminLogin.message || 'Login Failed!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })

            }

        } catch (err) {
            console.error('Error logging in:', err);
            Swal.fire({
                title: 'Error!',
                text: 'Login Failed!',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Update userDetail state based on input name
        setUserDetail({
            ...userDetail,
            [name]: value,
        });

    };

  return (
    <div className={styles.login}>
    <h1>LOGIN HERE</h1>
    <div className={styles.container}>

        <form onSubmit={handleLogin}>
            <div>
                <InputField
                    label='Email'
                    type="email"
                    name="email"
                    value={userDetail.email}
                    onChange={handleChange}
                    placeholder='Enter your email address'
                />
            </div>
            <div>
                <InputField
                    type="password"
                    name="password"
                    value={userDetail.password}
                    onChange={handleChange}
                    label='Password'
                    placeholder='Enter your password'
                />
            </div>
            <div className={styles.button}>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

             
            </div>

            {error && <p>Error: {error.message}</p>}
        </form>
     
    </div>
</div>
  )
}

export default AdminLogin