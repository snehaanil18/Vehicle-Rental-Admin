"use Client";
import React from 'react'
import InputField from '@/Utils/Components/InputField/InputField';
import styles from './navbar.module.css'
import filter from '../../../../Themes/Images/filter-svgrepo-com.svg'
import Image from 'next/image';


function Navbar() {
  return (
    <div>
        <div className={styles.Navbar}>
            <div className={styles.search}>
                <InputField type='text' placeholder='Search Cars' name='search'/>
            </div>
            <div className={styles.buttons}>
                <button>Add Cars</button>
                <button>
                  <Image src={filter} alt='' height={13} width={20}/>
                  Filter
                </button>
            </div>
        </div>
    </div>
  )
}

export default Navbar