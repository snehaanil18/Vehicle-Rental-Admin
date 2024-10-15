"use client";
import { useState } from 'react';
import styles from './sidebar.module.css';
import Button from '@/Utils/Components/Button/Button';
import Navbar from '../Navbar/Navbar';
import Image from 'next/image';
import car from '../../../../Themes/Images/car-svgrepo-com.svg';
import user from '../../../../Themes/Images/users-svgrepo-com.svg'
// import calender from '../../../../Themes/Images/calendar-svgrepo-com.svg'
import cash from '../../../../Themes/Images/credit-card-pay-svgrepo-com.svg'
import settings from '@/Themes/Images/settings-svgrepo-com.svg'
import man from '@/Themes/Images/car-controller-part-svgrepo-com.svg'
import model from '@/Themes/Images/car-travel-svgrepo-com.svg'
import AddManufacturers from '@/Modules/Manufacturers/Components/AddManufacturers/addManufacturer';
import AddModels from '@/Modules/Manufacturers/Components/AddModels/addModel';
import CustomerView from '@/Modules/Customers/Views/customerView';
import PaymentView from '@/Modules/Payments/Views/paymentView';

const Sidenav = () => {
    const [activeTab, setActiveTab] = useState('Cars');
    const [show, setShow] = useState(false)

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleCollapse = () => {
        setShow(!show)
    }

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
                        label="Bookings"
                        onClick={() => handleTabChange('Customers')}
                        className={activeTab === 'Customers' ? styles.activeTab : ''}
                    />
                </div>

                {/* <div className={styles.sideButtons}>
                    <Image src={calender} alt='calender' height={20} width={20} />
                    <Button
                        label="Calendar"
                        onClick={() => handleTabChange('Calendar')}
                        className={activeTab === 'Calendar' ? styles.activeTab : ''}
                    />
                </div> */}

                <div className={styles.sideButtons}>
                    <Image src={cash} alt='transaction' height={20} width={20} />
                    <Button
                        label="Transactions"
                        onClick={() => handleTabChange('Transactions')}
                        className={activeTab === 'Transactions' ? styles.activeTab : ''}
                    />
                </div>

                <div className={styles.sideButtons}>
                    <Image src={settings} alt='settings' height={20} width={20} />
                    <Button
                        label="Settings"
                        onClick={() => handleCollapse()}
                        className={activeTab === 'Transactions' ? styles.activeTab : ''}
                    />
                </div>

                {show && (
                    <div className={styles.settings}>
                        <div className={styles.sideButtons}>
                            <Image src={man} alt='manufacturers' height={20} width={20} />
                            <Button
                                label="Manufacturers"
                                onClick={() => handleTabChange('Manufacturers')}
                                className={activeTab === 'Manufacturers' ? styles.activeTab : ''}
                            />
                        </div>
                        <div className={styles.sideButtons}>
                            <Image src={model} alt='model' height={20} width={20} />
                            <Button
                                label="Models"
                                onClick={() => handleTabChange('Models')}
                                className={activeTab === 'Models' ? styles.activeTab : ''}
                            />
                        </div>
                    </div>
                )}

            </div>

            <div className={styles.tabContent}>

                {activeTab === 'Cars' && <div>
                    <Navbar />

                </div>}
                {activeTab === 'Customers' && <div>
                    <CustomerView/>
                </div>}
                {activeTab === 'Transactions' && <div>
                    <PaymentView/>
                </div>}
                {activeTab === 'Manufacturers' && <div>
                    <AddManufacturers/>    
                </div>}
                {activeTab === 'Models' && <div>
                    <AddModels/>    
                </div>}
            </div>
        </div>

    );
};

export default Sidenav;