import React from 'react'
import Sidenav from '../Components/Sidebar/sidebar'
import styles from './dashboard.module.css'


function DashboardView() {
  return (
    <div>
        <div className={styles.container}>
            <Sidenav/>
        </div>
    </div>
  )
}

export default DashboardView