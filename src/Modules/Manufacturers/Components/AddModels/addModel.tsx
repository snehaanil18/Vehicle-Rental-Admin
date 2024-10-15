"use client";
import React, { useState } from 'react';
import styles from './models.module.css';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_MANUFACTURERS, GET_ALL_MODELS, ADD_MODEL } from '../../Services/mutations';
import { Manufacturer, Model } from '@/Utils/Models/manufacturer';
import Image from 'next/image';
import add from '@/Themes/Images/edit-3-svgrepo-com.svg';
import InputField from '@/Utils/Components/InputField/InputField';
import close from '@/Themes/Images/close-circle-svgrepo-com.svg';
import Button from '@/Utils/Components/Button/Button';

function AddModels() {
    const { loading: loadingManufacturers, error: errorManufacturers, data: dataManufacturers } = useQuery<{ getAllManufacturers: Manufacturer[] }>(GET_ALL_MANUFACTURERS);
    const { loading: loadingModels, error: errorModels, data: dataModels } = useQuery<{ getAllModels: Model[] }>(GET_ALL_MODELS);

    const [show, setShow] = useState(false);
    const [modelName, setModelName] = useState("");
    const [year, setYear] = useState("");
    const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);

    const [addModel] = useMutation(ADD_MODEL, {
        refetchQueries: [{ query: GET_ALL_MODELS }], // Refetch models after adding a new one
        onCompleted: () => {
            setModelName(""); // Clear the input fields after successful submission
            setYear("");
            setSelectedManufacturer(null);
        },
        onError: (error) => {
            console.error('Error adding model:', error); // Highlighted change: Error handling
        },
    });

    const handleCollapse = () => {
        setShow(!show);
    };

    const handleSubmit = async () => {
        if (!modelName || !selectedManufacturer) {
            alert("Please select a manufacturer and enter a model name.");
            return;

        }
        console.log('button',modelName,year,selectedManufacturer);
        
        try {
            await addModel({
                variables: {
                    name: modelName,
                    year: parseInt(year), 
                    manufacturerid: selectedManufacturer,
                },
            });
            setShow(!show)
        } catch (error) {
            console.error('Error submitting form:', error); 
        }
        
    };

    if (loadingManufacturers || loadingModels) return <p className={styles.loading}>Loading...</p>;
    if (errorManufacturers || errorModels) return <p className={styles.error}>Error loading data.</p>;

    // Helper function to get manufacturer name by manufacturerId
    const getManufacturerNameById = (manufacturerId: string) => {
        const manufacturer = dataManufacturers?.getAllManufacturers.find(man => man.id === manufacturerId);
        return manufacturer ? manufacturer.name : 'Unknown';
    };

    return (
        <div>
            <div className={styles.container}>

                <div className={styles.add}>
                    <button onClick={() => handleCollapse()}>
                        {show ? <Image src={close} alt='close' height={25} width={25} /> : <Image src={add} alt='add' height={20} width={20} />}
                    </button>
                </div>

                {show ? (
                    <div className={styles.addDetail}>
                        <h2>Add Model</h2>
                        <label htmlFor="manufacturerSelect">Select Manufacturer</label>
                        <select
                            name="Manufacturers"
                            id="manufacturerSelect"
                            value={selectedManufacturer || ""}
                            onChange={(e) => setSelectedManufacturer(e.target.value)}
                        >
                            <option value="" disabled>Select a manufacturer</option>
                            {dataManufacturers?.getAllManufacturers.map((manufacturer) => (
                                <option key={manufacturer.id} value={manufacturer.id}>
                                    {manufacturer.name}
                                </option>
                            ))}
                        </select>

                        <InputField
                            label="Model Name"
                            type="text"
                            name="modelName"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                        />

                        <InputField
                            label="Year"
                            type="text"
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />

                        <Button label="Add" onClick={handleSubmit} />
                    </div>
                ) : (
                    <div>
                        <h2>Models</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Model Name</th>
                                    <th>Year</th>
                                    <th>Manufacturer Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataModels?.getAllModels.map((model) => (
                                    <tr key={model.id}>
                                        <td>{model.id}</td>
                                        <td>{model.name}</td>
                                        <td>{model.year}</td>
                                        <td>{getManufacturerNameById(model.manufacturerid)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddModels;
