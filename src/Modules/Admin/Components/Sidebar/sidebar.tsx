"use client";
import { useState } from 'react';
import styles from './sidebar.module.css';
import Button from '@/Utils/Components/Button/Button';
import Navbar from '../Navbar/Navbar';
import AddVehicleForm from '@/Modules/Cars/Components/AddVehicle/addCar';
import VehicleList from '@/Modules/Cars/Components/AllVehicles/allCars';
import Image from 'next/image';
import car from '../../../../Themes/Images/car-svgrepo-com.svg';
import user from '../../../../Themes/Images/users-svgrepo-com.svg'
import calender from '../../../../Themes/Images/calendar-svgrepo-com.svg'
import cash from '../../../../Themes/Images/credit-card-pay-svgrepo-com.svg'

const Sidenav = () => {
    const [activeTab, setActiveTab] = useState('Cars');

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.sidebarContainer}>
                <h1>Dashboard</h1>
                <div className={styles.sideButtons}>
                    <Image src={car} alt='car' height={20} width={20} />
                    <Button
                        label="Cars"
                        onClick={() => handleTabChange('Cars')}
                        className={activeTab === 'Cars' ? styles.activeTab : ''}
                    />
                </div>

                <div className={styles.sideButtons}>
                    <Image src={user} alt='people' height={20} width={20} />
                    <Button
                        label="Customers"
                        onClick={() => handleTabChange('Customers')}
                        className={activeTab === 'Customers' ? styles.activeTab : ''}
                    />
                </div>

                <div className={styles.sideButtons}>
                    <Image src={calender} alt='calender' height={20} width={20} />
                    <Button
                        label="Calendar"
                        onClick={() => handleTabChange('Calendar')}
                        className={activeTab === 'Calendar' ? styles.activeTab : ''}
                    />
                </div>

                <div className={styles.sideButtons}>
                    <Image src={cash} alt='transaction' height={20} width={20} />
                    <Button
                        label="Transactions"
                        onClick={() => handleTabChange('Transactions')}
                        className={activeTab === 'Transactions' ? styles.activeTab : ''}
                    />
                </div>

            </div>

            <div className={styles.tabContent}>
                
                {activeTab === 'Cars' && <div>
                    <Navbar />
                    <AddVehicleForm />
                </div>}
                {activeTab === 'Customers' && <div>
                    <VehicleList/>
                </div>}
                {activeTab === 'Calendar' && <div>Calendar and scheduling content here</div>}
            </div>
        </div>

    );
};

export default Sidenav;