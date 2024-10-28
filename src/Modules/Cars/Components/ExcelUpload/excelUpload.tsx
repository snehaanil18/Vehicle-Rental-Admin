"use client";
import React, { useState } from 'react';
import styles from './excel.module.css'
import Modal from '@/Utils/Components/Modal/modal';
import { ADD_VEHICLE_MUTATION } from '../../Services/mutations';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { DataDisplayProps } from '@/Utils/Models/data';
import Image from 'next/image';


const ExcelUpload: React.FC<DataDisplayProps> = ({ data }) => {
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [vehicleDetails, setVehicleDetails] = useState<{ images: File[] }>({ images: [] });
  const [primaryimageindex, setPrimaryimageindex] = useState<number | null>(null);
  const [addVehicle] = useMutation(ADD_VEHICLE_MUTATION);

  const openModal = (index: number) => {
    setSelectedVehicleIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicleIndex(null);
    setVehicleDetails({ images: [] });
    setPrimaryimageindex(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setVehicleDetails((prevDetails) => ({
        ...prevDetails,
        images: [...prevDetails.images, ...filesArray],
      }));
    }
  };

  const handlePrimaryImageSelect = (index: number) => {
    setPrimaryimageindex(index);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = vehicleDetails.images.filter((_, i) => i !== index);
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      images: updatedImages,
    }));

    if (primaryimageindex === index) {
      setPrimaryimageindex(null);
    } else if (primaryimageindex !== null && primaryimageindex > index) {
      setPrimaryimageindex((prevIndex) => (prevIndex !== null ? prevIndex - 1 : null));
    }
  };

  const handleAddVehicle = async () => {
    try {
      if (selectedVehicleIndex !== null) {
        const selectedVehicle = data[selectedVehicleIndex];



        // Check if images is an array
        if (!Array.isArray(vehicleDetails.images)) {
          console.error("Images should be an array");
          return;
        }

        const { name, description, price, vehicletype, model, manufacturer, transmission, fueltype, quantity } = selectedVehicle;



        // Call the addVehicle mutation
        await addVehicle({
          variables: {
            name,
            description,
            price: parseFloat(price),
            model,
            manufacturer,
            quantity: parseInt(quantity, 10),
            transmission,
            fueltype,
            vehicletype,
            images: vehicleDetails.images,
            primaryimageindex: primaryimageindex ?? 0,
          },
        });


        Swal.fire({
          title: 'Success!',
          text: 'Vehicle added',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        closeModal();


      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add vehicle. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div>
      <h2>Excel Upload Data</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Manufacturer</th>
            <th className={styles.th}>Model</th>
            <th className={styles.th}>Vehicle Type</th>
            <th className={styles.th}>Quantity</th>
            <th className={styles.th}>Transmission</th>
            <th className={styles.th}>Fuel Type</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index + 1} className={styles.tr}>
              <td className={styles.td}>{item.name}</td>
              <td className={styles.td}>{item.description}</td>
              <td className={styles.td}>{item.price}</td>
              <td className={styles.td}>{item.manufacturer}</td>
              <td className={styles.td}>{item.model}</td>
              <td className={styles.td}>{item.vehicletype}</td>
              <td className={styles.td}>{item.quantity}</td>
              <td className={styles.td}>{item.transmission}</td>
              <td className={styles.td}>{item.fueltype}</td>
              <td className={styles.td}>
                <button onClick={() => openModal(index)}>Upload Images</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>

        <div className={styles.addVehicleForm}>
          <label htmlFor="image">Upload Images:</label>
          <input type="file" multiple onChange={handleImageChange} />

          {vehicleDetails.images.length > 0 && (
            <div className={styles.imagePreview}>
              {vehicleDetails.images.map((image, index) => (
                <div key={index} className={styles.imageContainer}>
                  <Image src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} height={100} width={115} />
                  <div className={styles.imageActions}>
                    <label>
                      <input
                        type="checkbox"
                        checked={primaryimageindex === index}
                        onChange={() => handlePrimaryImageSelect(index)}
                      />
                      Primary Image
                    </label>
                    <button type="button" onClick={() => handleRemoveImage(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={styles.button}>
            <button onClick={handleAddVehicle}>ADD Vehicle</button>
          </div>

        </div>
      </Modal>
    </div>
  );
};

export default ExcelUpload;
