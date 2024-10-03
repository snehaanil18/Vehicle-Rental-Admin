"use client";
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { ADD_VEHICLE_MUTATION, GET_ALL_MANUFACTURERS, GET_MODELS_BY_MANUFACTURER } from '../../Services/mutations';
import styles from './add.module.css';
import InputField from '@/Utils/Components/InputField/InputField';
import Button from '@/Utils/Components/Button/Button';
import Swal from 'sweetalert2';

interface VehicleDetails {
  name: string;
  description: string;
  price: string;
  model: string;
  manufacturer: string;
  quantity: string;
  vehicletype: string;
  transmission: string;
  fueltype: string;
  primaryimage: File | null;
  otherimages: File[];
}

interface Manufacturer {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
  year: number;
}

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
    primaryimage: null,
    otherimages: [],
  });

  const [errorMessages, setErrorMessages] = useState<Partial<Record<keyof VehicleDetails, string>>>({});
  const [addVehicle] = useMutation(ADD_VEHICLE_MUTATION);
  const transmissionOptions = ['Manual', 'Automatic'];
  const fuelTypeOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

  const { loading: loadingManufacturers, error: errorManufacturers, data: dataManufacturers } = useQuery<{ getAllManufacturers: Manufacturer[] }>(GET_ALL_MANUFACTURERS);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState('');

  const { loading: loadingModels, error: errorModels, data: dataModels } = useQuery(GET_MODELS_BY_MANUFACTURER, {
    variables: { manufacturerId: selectedManufacturer },
    skip: !selectedManufacturer,
  });

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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setVehicleDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
    validateForm();
    setErrorMessages(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name } = event.target;
    validateForm(); // Validate on blur
  };

  const handlePrimaryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setVehicleDetails(prevDetails => ({
      ...prevDetails,
      primaryimage: file,
    }));
    setErrorMessages(prevErrors => ({
      ...prevErrors,
      primaryimage: '',
    }));
  };

  const handleOtherImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setVehicleDetails(prevDetails => ({
        ...prevDetails,
        otherimages: [...prevDetails.otherimages, ...filesArray],
      }));
    }
  };

  const validateForm = () => {
    const { name, description, price, vehicletype, transmission, fueltype, primaryimage, quantity } = vehicleDetails;
    const errors: Record<string, string> = {};

    if (!name) {
      errors.name = 'Vehicle name is required.';
    }
    if (!description) {
      errors.description = 'Description is required.';
    }
    if (!price) {
      errors.price = 'Price is required.';
    } else if (parseFloat(price) <= 0) {
      errors.price = 'Price must be a positive number.';
    }
    if (!quantity) {
      errors.quantity = 'Quantity is required.';
    } else if (parseInt(quantity, 10) <= 0) {
      errors.quantity = 'Quantity must be a positive integer.';
    }
    if (!vehicletype) {
      errors.vehicletype = 'Vehicle type is required.';
    }
    if (!transmission) {
      errors.transmission = 'Transmission type is required.';
    }
    if (!fueltype) {
      errors.fueltype = 'Fuel type is required.';
    }
    if (!primaryimage) {
      errors.primaryimage = 'Primary image is required.';
    }

    setErrorMessages(errors);
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return; // Stop submission if validation fails
    }

    const { name, description, price, vehicletype, transmission, fueltype, primaryimage, otherimages, quantity } = vehicleDetails;

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
          primaryimage,
          otherimages,
        },
      });
      Swal.fire({
        title: 'Success!',
        text: 'Vehicle added',
        icon: 'success',
        confirmButtonText: 'OK',
      });
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
        primaryimage: null,
        otherimages: [],
      });
      setSelectedManufacturer('');
      setSelectedModel('');
    } catch (err) {
      console.error('Error adding vehicle:', err);
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
          rows={4}  // Adjust the number of rows based on your preference
          required
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
          placeholder="Enter quantity"
          required
        />
        {errorMessages.quantity && <p className={styles.error}>{errorMessages.quantity}</p>}

        <label htmlFor="vehicletype">Vehicle Type:</label>
        <select
          id="vehicletype"
          name="vehicletype"
          value={vehicleDetails.vehicletype}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select vehicle type</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Truck">Truck</option>
        </select>
        {errorMessages.vehicletype && <p className={styles.error}>{errorMessages.vehicletype}</p>}

        <label htmlFor="transmission">Transmission:</label>
        <select
          id="transmission"
          name="transmission"
          value={vehicleDetails.transmission}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select transmission</option>
          {transmissionOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errorMessages.transmission && <p className={styles.error}>{errorMessages.transmission}</p>}

        <label htmlFor="fueltype">Fuel Type:</label>
        <select
          id="fueltype"
          name="fueltype"
          value={vehicleDetails.fueltype}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select fuel type</option>
          {fuelTypeOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errorMessages.fueltype && <p className={styles.error}>{errorMessages.fueltype}</p>}

        <label htmlFor="primaryimage">Primary Image:</label>
        <input
          type="file"
          id="primaryimage"
          name="primaryimage"
          accept="image/*"
          onChange={handlePrimaryImageChange}
          onBlur={handleBlur}
        />
        {errorMessages.primaryimage && <p className={styles.error}>{errorMessages.primaryimage}</p>}

        <label htmlFor="otherimages">Other Images:</label>
        <input
          type="file"
          id="otherimages"
          name="otherimages"
          accept="image/*"
          multiple
          onChange={handleOtherImagesChange}
        />

        <Button type="submit" label='Add Vehicle' />
      </form>
    </div>
  );
};

export default AddVehicleForm;
