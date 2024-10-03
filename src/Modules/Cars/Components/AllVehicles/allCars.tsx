"use client";
import React from 'react'
import { useQuery } from '@apollo/client';
import {GET_ALL_VEHICLES} from '../../Services/mutations'
import Image from 'next/image';
import styles from './allCars.module.css'

interface Vehicle {
    id: string;
    name: string;
    description: string;
    price: number;
    primaryimage: string;
  }

const VehicleList = () => {
    const { loading, error, data } = useQuery<{ getAllVehicles: Vehicle[] }>(GET_ALL_VEHICLES);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    return (
      <div className={styles.container}>
        <h1>Vehicles</h1>
        <ul>
          {data?.getAllVehicles.map((vehicle: Vehicle) => (
            <li key={vehicle.id}>
              <h2>{vehicle.name}</h2>
              <p>{vehicle.description}</p>
              <p>Price: ${vehicle.price}</p>
              <Image src={vehicle.primaryimage} alt={vehicle.name} height={200} width={300} />
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default VehicleList;