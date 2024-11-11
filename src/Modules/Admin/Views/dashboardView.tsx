"use client";
import React from 'react'
import Sidenav from '../Components/Sidebar/sidebar'
import styles from './dashboard.module.css'
import { useRouter } from 'next/navigation';

function DashboardView() {
  const router = useRouter();
  const token = sessionStorage.getItem('token')
  if(!token){
    router.push('/')
  }

  return (
    <div>
        <div className={styles.container}>
            <Sidenav/>
        </div>
    </div>
  )
}

export default DashboardView