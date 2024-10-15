"use Client";
import React, { useState } from 'react'
import InputField from '@/Utils/Components/InputField/InputField';
import styles from './navbar.module.css'

import VehicleList from '@/Modules/Cars/Components/AllVehicles/allCars';
import AddVehicleForm from '@/Modules/Cars/Components/AddVehicle/addCar';

import { useLazyQuery, useQuery } from '@apollo/client';
import { SEARCH_VEHICLES } from '../../Services/mutations'
import { GET_ALL_VEHICLES } from '@/Modules/Cars/Services/mutations';

function Navbar() {

  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const { loading: loadingAll, error: errorAll, refetch } = useQuery(GET_ALL_VEHICLES);

  
  const [searchVehicles, { loading, error }] = useLazyQuery(SEARCH_VEHICLES, {
    onCompleted: (data) => {
      setSearchResults(data.searchVehicles);
    },
  });

  const handleShow = () => {
    setShow(!show);

    if (!show) {
      // If switching to All Cars, refetch all vehicles
      refetch();
    } else {
      // Optionally, clear search results when switching to Add Car
      setSearchResults([]);
    }
  };

  const handleSearchChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) { // Start searching after 3 characters
      searchVehicles({ variables: { query: value } });
    } else {
      setSearchResults([]); // Clear results if input is less than 3 characters
    }
  };



  return (
    <div>
      <div className={styles.Navbar}>
        {show?  <div className={styles.blank}> </div>:
            <div className={styles.search}>
            <InputField type='text' placeholder='Search Cars' name="search" value={searchTerm} onChange={handleSearchChange} />
          </div>
        }
    
        <div className={styles.buttons}>
    
          <button onClick={handleShow}>
            {show ? 'All Cars' : 'Add Car'}
          </button>
        </div>
      </div>
      {(loading || loadingAll)  && <p className={styles.loading}>Loading...</p>}
      {(error || errorAll) && <p className={styles.loading}>Error fetching vehicles</p>}
      {/* Pass searchResults to VehicleList */}

      {show ? <AddVehicleForm /> :<VehicleList vehicles={searchResults.length > 0 ? searchResults : undefined} />}
    </div>
  )
}

export default Navbar