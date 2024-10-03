import React from 'react'
import AddVehicleForm from '../Components/AddVehicle/addCar'
import VehicleList from '../Components/AllVehicles/allCars'

function VehicleView() {
  return (
    <div>
        <AddVehicleForm/>
        <VehicleList/>
    </div>
  )
}

export default VehicleView