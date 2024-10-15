"use client";
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { ADD_VEHICLE_MUTATION} from '../../Services/mutations';
import { GET_MODELS_BY_MANUFACTURER, GET_ALL_MANUFACTURERS } from  '@/Modules/Manufacturers/Services/mutations'
import styles from './add.module.css';
import InputField from '@/Utils/Components/InputField/InputField';
import Button from '@/Utils/Components/Button/Button';
import Swal from 'sweetalert2';
import { VehicleDetails } from '@/Utils/Models/vehicle';
import { Manufacturer, Model } from '@/Utils/Models/manufacturer';
import Image from 'next/image';
import remove from '@/Themes/Images/cross-circle-svgrepo-com.svg'

const AddVehicleForm = () => {
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails>({
    name: '',
    description: '',
    price: '',
    model: '',
    manufacturer: '',
    quantity: '',
    vehicletype: '',
    transmission: '',
    fueltype: '',
    images: [],
  });

  const [errorMessages, setErrorMessages] = useState<Partial<Record<keyof VehicleDetails, string>>>({});
  const [addVehicle] = useMutation(ADD_VEHICLE_MUTATION);
  const transmissionOptions = ['Manual', 'Automatic'];
  const fuelTypeOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const vehicleTypeOptions = ['SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Wagon'];

  const { loading: loadingManufacturers, error: errorManufacturers, data: dataManufacturers } = useQuery<{ getAllManufacturers: Manufacturer[] }>(GET_ALL_MANUFACTURERS);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState('');

  const { loading: loadingModels, error: errorModels, data: dataModels } = useQuery(GET_MODELS_BY_MANUFACTURER, {
    variables: { manufacturerid: selectedManufacturer },
    skip: !selectedManufacturer,
  });

  const [primaryimageindex, setPrimaryimageindex] = useState<number | null>(null);

  useEffect(() => {
    if (dataModels) {
      setModels(dataModels.getModelsByManufacturer);
      setSelectedModel(''); // Reset model when manufacturer changes
    }
  }, [dataModels]);

  useEffect(() => {
    const manufacturerName = dataManufacturers?.getAllManufacturers.find(man => man.id === selectedManufacturer)?.name || '';
    const modelName = models.find(mod => mod.id === selectedModel)?.name || '';

    setVehicleDetails(prevDetails => ({
      ...prevDetails,
      name: selectedManufacturer && selectedModel ? `${manufacturerName} ${modelName}` : '',
    }));
  }, [selectedManufacturer, selectedModel, dataManufacturers, models]);

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

    // Reset primary image if it's removed
    if (primaryimageindex === index) {
      setPrimaryimageindex(null);
    } else if (primaryimageindex !== null && primaryimageindex > index) {
      // Adjust primary image index if images before it were removed
      setPrimaryimageindex((prevIndex) => (prevIndex !== null ? prevIndex - 1 : null));
    }
  };

  const validateField = (name: keyof VehicleDetails, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return !value ? 'Vehicle name is required.' : undefined;
      case 'description':
        return !value ? 'Description is required.' : undefined;
      case 'price':
        if (!value) return 'Price is required.';
        if (parseFloat(value) <= 0) return 'Price must be a positive number.';
        break;
      case 'quantity':
        if (!value) return 'Quantity is required.';
        if (parseInt(value, 10) <= 0) return 'Quantity must be a positive integer.';
        break;
      case 'vehicletype':
        return !value ? 'Vehicle type is required.' : undefined;
      case 'transmission':
        return !value ? 'Transmission type is required.' : undefined;
      case 'fueltype':
        return !value ? 'Fuel type is required.' : undefined;
      case 'images':
        return vehicleDetails.images.length === 0 ? 'At least one image is required.' : undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setVehicleDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));

    const errorMessage = validateField(name as keyof VehicleDetails, value);
    setErrorMessages(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage || '', // Clear error message if valid
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const errorMessage = validateField(name as keyof VehicleDetails, value);
    setErrorMessages(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage || '', // Clear error message if valid
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('7',vehicleDetails.images,'4');
    
  
    const { name, description, price, vehicletype, transmission, fueltype, images, quantity } = vehicleDetails;
    console.log(images,'img');
    
    try {
      await addVehicle({
        variables: {
          name,
          description,
          price: parseFloat(price),
          model: selectedModel,
          manufacturer: selectedManufacturer,
          quantity: parseInt(quantity, 10),
          transmission,
          fueltype,
          vehicletype,
          images, 
          primaryimageindex: primaryimageindex ?? 0,
        },
      });
      
      Swal.fire({
        title: 'Success!',
        text: 'Vehicle added',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      
      // Reset form state
      setVehicleDetails({
        name: '',
        description: '',
        price: '',
        model: '',
        manufacturer: '',
        quantity: '',
        vehicletype: '',
        transmission: '',
        fueltype: '',
        images: [],
      });
      setPrimaryimageindex(null);
      setSelectedManufacturer('');
      setSelectedModel('');
      
    } catch (err) {
      console.error('Error adding vehicle:', err);

      Swal.fire({
        title: 'Error!',
        text: 'Failed to add vehicle. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  
  if (loadingManufacturers) return <p>Loading manufacturers...</p>;
  if (errorManufacturers) return <p>Error fetching manufacturers: {errorManufacturers.message}</p>;

  return (
    <div className={styles.container}>
      <form className={styles.formContent} onSubmit={handleSubmit}>
        <label htmlFor="manufacturer">Manufacturer:</label>
        <select
          id="manufacturer"
          onChange={(e) => {
            setSelectedManufacturer(e.target.value);
            setSelectedModel('');
          }}
        >
          <option value="">Select a manufacturer</option>
          {dataManufacturers?.getAllManufacturers.map((manufacturer) => (
            <option key={manufacturer.id} value={manufacturer.id}>
              {manufacturer.name}
            </option>
          ))}
        </select>

        {selectedManufacturer && (
          <div className={styles.models}>
            <label htmlFor="model">Model:</label>
            {loadingModels && <p>Loading models...</p>}
            {errorModels && <p>Error fetching models: {errorModels.message}</p>}
            {!loadingModels && !errorModels && (
              <select id="model" onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">Select a model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.year})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <InputField
          label="Vehicle Name"
          type="text"
          name="name"
          value={vehicleDetails.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Vehicle Name"
        />
        {errorMessages.name && <p className={styles.error}>{errorMessages.name}</p>}

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={vehicleDetails.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter vehicle description"
          rows={4}
          // required
        />
        {errorMessages.description && <p className={styles.error}>{errorMessages.description}</p>}

        <InputField
          label="Price"
          type="number"
          name="price"
          value={vehicleDetails.price}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Price"
        />
        {errorMessages.price && <p className={styles.error}>{errorMessages.price}</p>}

        <InputField
          label="Quantity"
          type="number"
          name="quantity"
          value={vehicleDetails.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Quantity"
        />
        {errorMessages.quantity && <p className={styles.error}>{errorMessages.quantity}</p>}

        <label htmlFor="manufacturer">Vehicle Type:</label>
        <select name="vehicletype" value={vehicleDetails.vehicletype} onChange={handleChange} onBlur={handleBlur}>
          <option value="">Select type</option>
          {vehicleTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errorMessages.vehicletype && <p className={styles.error}>{errorMessages.vehicletype}</p>}

        <label htmlFor="manufacturer">Transmission:</label>
        <select name="transmission" value={vehicleDetails.transmission} onChange={handleChange} onBlur={handleBlur}>
          <option value="">Select transmission</option>
          {transmissionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errorMessages.transmission && <p className={styles.error}>{errorMessages.transmission}</p>}

        <label htmlFor="manufacturer">Fuel Type:</label>
        <select name="fueltype" value={vehicleDetails.fueltype} onChange={handleChange} onBlur={handleBlur}>
          <option value="">Select fuel type</option>
          {fuelTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errorMessages.fueltype && <p className={styles.error}>{errorMessages.fueltype}</p>}

        <div className={styles.addVehicleForm}>
      <label htmlFor="image">Upload Images:</label>
      <input type="file" multiple onChange={handleImageChange} />
      {errorMessages.images && <p className={styles.error}>{errorMessages.images}</p>}

      {vehicleDetails.images.length > 0 && (
        <div className={styles.imagePreview}>
          {vehicleDetails.images.map((image, index) => (
            <div key={index} className={styles.imageContainer}>
              <Image src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} height={100} width={115} />
              <div className={styles.imageActions}>
                <label htmlFor={`primaryImage-${index}`}>
                  <input
                    type="checkbox"
                    checked={primaryimageindex === index}
                    onChange={() => handlePrimaryImageSelect(index)}
                  />
                  Primary Image
                  </label>
                <button id={styles.remove} type="button" onClick={() => handleRemoveImage(index)}>
                  <Image src={remove} alt='remove' height={15} width={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
        <div className={styles.addButton}>
          <Button type="submit" label="Add Vehicle" />
        </div>
       
      </form>
    </div>
  );
};

export default AddVehicleForm;
