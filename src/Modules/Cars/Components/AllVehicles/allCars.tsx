"use client";
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_VEHICLES, DELETE_VEHICLE } from '../../Services/mutations';
import styles from './allCars.module.css';
import Image from 'next/image';
import { Vehicle, VehicleListProps } from '@/Utils/Models/vehicle';
import add from '@/Themes/Images/edit-3-svgrepo-com.svg';
import EditVehicle from '../EditVehicle/editCar';
import del from '@/Themes/Images/delete-svgrepo-com.svg'
import Swal from 'sweetalert2';

const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => {
    const { loading, error, data, refetch } = useQuery<{ getAllVehicles: Vehicle[] }>(GET_ALL_VEHICLES);
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); 
    const [deleteVehicle] = useMutation(DELETE_VEHICLE, {
        onCompleted: () => {
            refetch(); 
        },
        onError: (error) => {
            console.error('Error deleting vehicle:', error);
        },
    });
    

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>Error: {error.message}</p>;

    const vehicleData = vehicles || data?.getAllVehicles || [];

    const handleEdit = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setShowModal(true); // Show the modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
        refetch(); 
        setSelectedVehicle(null);
       
    };


    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteVehicle({ variables: { id } });
                Swal.fire('Deleted!', 'Your vehicle has been deleted.', 'success');
            } else {
                Swal.fire('Cancelled', 'Vehicle deletion cancelled', 'error');
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                {vehicleData.map((vehicle: Vehicle) => (
                    <div key={vehicle.id} className={styles.card}>
                        <div className={styles.cardImg}>
                            <Image src={vehicle.primaryimage} alt={vehicle.name} height={200} width={300} />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.title}>
                                <h3 className={styles.cardTitle}>{vehicle.name}</h3>
                                <div className={styles.actions}>
                                    <button
                                        onClick={() => handleEdit(vehicle)} className={styles.editButton} aria-label={`Edit ${vehicle.name}`}>
                                        <Image src={add} alt='edit' height={20} width={20} />
                                    </button>
                                    <button onClick={() => handleDelete(vehicle.id)} disabled={loading}>
                                        <Image src={del} alt='delete' height={20} width={25} />
                                    </button>
                                </div>

                            </div>

                            <div className={styles.description}>
                                <details>
                                    <summary>Description</summary>
                                    {vehicle.description}
                                </details>

                            </div>
                            <div>Transmission: {vehicle.transmission} </div>
                            <div>Fuel type: {vehicle.fueltype} </div>
                            <div>Price: {vehicle.price} </div>
                            <div className={styles.qty}>Available Quantity: {vehicle.quantity}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Conditionally render the EditVehicleModal */}
            {showModal && selectedVehicle && (
                <EditVehicle vehicle={selectedVehicle} onClose={() => handleCloseModal()} />
            )}
        </div>
    );
};

export default VehicleList;
