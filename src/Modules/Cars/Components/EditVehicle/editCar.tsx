"use client"
import React, { useState } from 'react';
import { VehicleEdit } from '@/Utils/Models/vehicle';
import styles from './edit.module.css';
import InputField from '@/Utils/Components/InputField/InputField';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { UPDATE_VEHICLE, UPDATE_VEHICLE_IMAGES } from '../../Services/mutations';
import Swal from 'sweetalert2';

interface EditVehicleModalProps {
    vehicle: VehicleEdit;
    onClose: () => void;
}

const EditVehicle: React.FC<EditVehicleModalProps> = ({ vehicle, onClose }) => {
    const [formData, setFormData] = useState(vehicle);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [showImageFields, setShowImageFields] = useState(false);

    const [updateVehicleImages] = useMutation(UPDATE_VEHICLE_IMAGES);

    const [updateVehicle, { loading, error }] = useMutation(UPDATE_VEHICLE, {
        onCompleted: (data) => {
            Swal.fire({
                title: 'Success!',
                text: data.updateVehicle.message,
                icon: 'success',
                confirmButtonText: 'OK',
            });
            onClose();
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: `Error updating vehicle: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImages([...newImages, ...Array.from(e.target.files)]);
        }
    };

    const removeExistingImage = (imageUrl: string, type: 'primary' | 'other') => {
        if (type === 'primary') {
            setFormData({ ...formData, primaryimage: '' });
        } else {
            setFormData({
                ...formData,
                otherimages: formData.otherimages.filter((img) => img !== imageUrl),
            });
        }
    };

    const changePrimaryImage = (file: File | string) => {
        setFormData({ ...formData, primaryimage: file });
    };

    const removeNewImage = (file: File) => {
        setNewImages(newImages.filter((img) => img !== file));
    };

    const saveImage = async () => {
        // Combine existing and new images
        const combinedImages = [
             formData.primaryimage,
            ...formData.otherimages,
            ...newImages,
        ];

        // Filter out invalid images
        const filteredImages = combinedImages.filter(image => image !== null && image !== undefined && image !== '');
        const formattedImages = filteredImages.map((image) => {
            return {
              url: typeof image === 'string' ? image : null, // Set URL if it's a string
              file: image instanceof File ? image : null, // Set File if it's a File object
            };
          });

          console.log('input1',formattedImages,'input');
          
        

        // Check if there are any images to update
        if (filteredImages.length === 0) {
            Swal.fire({
                title: 'Warning!',
                text: 'No valid images to update.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {

            // Call the mutation to update vehicle images
            await updateVehicleImages({
                variables: {
                    id: formData.id,
                    images: formattedImages, 
                },
            });
            
            // Show success alert
            Swal.fire({
                title: 'Success!',
                text: 'Images updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error("Failed to update vehicle images:", error);
            Swal.fire({
                title: 'Error!',
                text: `Error updating images`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateVehicle({
                variables: {
                    id: formData.id, // Ensure the vehicle id is included
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity, 10),
                },
            });
        } catch (error) {
            console.error("Failed to update vehicle:", error);
        }


        onClose();
    };


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.button}>
                    <button className={styles.closeButton} onClick={() => onClose()}>
                        &times;
                    </button>
                </div>

                <h2>Edit Vehicle</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='name'>Vehicle Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter vehicle description"
                        rows={4}
                        required
                    />

                    <InputField
                        label="Price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                    />

                    <InputField
                        label="Quantity"
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="Quantity"
                    />



                    <div className={styles.editImage}>
                        <button type="button" onClick={() => setShowImageFields(!showImageFields)}>
                            {showImageFields ? 'Hide Image Fields' : 'Edit Images'}
                        </button>
                    </div>


                    {showImageFields && (
                        <>
                            <h3>Primary Image</h3>
                            {formData.primaryimage && (
                                <div className={styles.imagePreview}>
                                    <Image src={formData.primaryimage instanceof File ? URL.createObjectURL(formData.primaryimage) : formData.primaryimage} alt="Primary" className={styles.image} height={100} width={100} />
                                    <button type="button" onClick={() => removeExistingImage(formData.primaryimage as string, 'primary')}>
                                        Remove
                                    </button>
                                </div>
                            )}

                            {/* Display Other Images */}
                            <h3>Other Images</h3>
                            {formData.otherimages.length > 0 ? (
                                formData.otherimages.map((img: string, index: number) => (
                                    <div key={index} className={styles.imagePreview}>
                                        <Image src={img} alt='other' className={styles.image} height={100} width={100} />
                                        <button type="button" onClick={() => removeExistingImage(img, 'other')}>
                                            Remove
                                        </button>
                                        <button type="button" onClick={() => changePrimaryImage(img)}>
                                            Set as Primary
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No other images</p>
                            )}

                            {/* Upload New Images */}
                            <h3>Add New Images</h3>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} />

                            {/* Preview New Images */}
                            {newImages.length > 0 && (
                                <div>
                                    <h3>New Images Preview</h3>
                                    {newImages.map((img, index) => (
                                        <div key={index} className={styles.imagePreview}>
                                            <Image src={URL.createObjectURL(img)} alt={`New image ${index + 1}`} height={100} width={100} className={styles.image} />
                                            <button type="button" onClick={() => removeNewImage(img)}>
                                                Remove
                                            </button>
                                            <button type="button" onClick={() => changePrimaryImage(img)}>
                                                Set as Primary
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className='image'>
                                <button onClick={saveImage}>
                                    Save Image
                                </button>
                            </div>
                        </>
                    )}

                    <div className={styles.save}>
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                    {error && <p className={styles.error}>Error: {error.message}</p>}
                </form>
            </div>
        </div>
    );
};

export default EditVehicle;
