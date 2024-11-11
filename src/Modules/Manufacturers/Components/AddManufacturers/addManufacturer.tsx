"use client";
import React, { useState } from 'react'
import styles from './manufacturer.module.css'
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_MANUFACTURERS, ADD_MANUFACTURER } from '../../Services/mutations';
import { Manufacturer } from '@/Utils/Models/manufacturer';
import Image from 'next/image';
import add from '@/Themes/Images/edit-3-svgrepo-com.svg'
import InputField from '@/Utils/Components/InputField/InputField';
import close from '@/Themes/Images/close-circle-svgrepo-com.svg'
import Button from '@/Utils/Components/Button/Button';


function AddManufacturers() {
    const { loading: loadingManufacturers, error: errorManufacturers, data: dataManufacturers, refetch } = useQuery<{ getAllManufacturers: Manufacturer[] }>(GET_ALL_MANUFACTURERS);
    const [addManufacturer] = useMutation(ADD_MANUFACTURER);

    const [show, setShow] = useState(false);
    const [manufacturerName, setManufacturerName] = useState("");

    const handleCollapse = () => {
        setShow(!show)
    }

    const handleSubmit = async () => {
        try {
            await addManufacturer({ variables: { name: manufacturerName } });
           
            await refetch();
            setManufacturerName(""); 
            setShow(false);
        } catch (error) {
            console.error("Error adding manufacturer:", error);
          
        }
    };

    if (loadingManufacturers) return <p className={styles.loading}>Loading...</p>;
    if (errorManufacturers) return <p className={styles.error}>Error loading manufacturers.</p>;
    return (
        <div>
            <div className={styles.container}>

                <div className={styles.add}>
                    <button onClick={() => handleCollapse()}>
                        {show?
                        <Image src={close} alt='close' height={25} width={25} />:
                        <Image src={add} alt='add' height={20} width={20} />
                    }
                    </button>
                </div>

                {show ?
                    <div className={styles.addDetail}>
                        <h2>Add Manufacturers</h2>
                        <InputField
                            label="Manufacturer Name"
                            type="text"
                            name="manufacturer"
                            value={manufacturerName}
                            onChange={(e) => setManufacturerName(e.target.value)}
                        />
                        <Button label='Add' onClick={handleSubmit}/>
                    </div>
                    :
                    <div>
                        <h2>Manufacturers</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Sl. no</th>
                                    <th>Id</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataManufacturers?.getAllManufacturers.map((manufacturer,index) => (
                                    <tr key={manufacturer.id}>
                                        <td>{index+1}</td>
                                        <td>{manufacturer.id}</td>
                                        <td>{manufacturer.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    )
}

export default AddManufacturers