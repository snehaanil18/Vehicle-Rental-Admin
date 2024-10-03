import { gql } from '@apollo/client';

export const ADD_VEHICLE_MUTATION = gql`
  mutation AddVehicle(
    $name: String!,
    $description: String,
    $price: Float!,
    $model: String!,
    $manufacturer: String!,
    $vehicletype: String!,
    $transmission: String!,
    $fueltype: String!,  
    $primaryimage: Upload!,
    $otherimages: [Upload]!
    $quantity: Int!
  ) {
    addVehicle(
      name: $name,
      description: $description,
      price: $price,
      model: $model,
      manufacturer: $manufacturer,
      vehicletype: $vehicletype,
      transmission: $transmission,
      fueltype: $fueltype,       
      primaryimage: $primaryimage,
      otherimages: $otherimages,
      quantity: $quantity
    ) {
      id
      name
      primaryimage
      otherimages
      quantity
      transmission     
      fueltype  
    }
  }
`;

export const GET_ALL_VEHICLES = gql`
  query GetAllVehicles {
    getAllVehicles {
      id
      name
      description
      price
      primaryimage
      otherimages
      model
      manufacturer
      quantity
      transmission   
      fueltype  
    }
  }
`;

export const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    getVehicle(id: $id) {
      id
      name
      description
      price
      primaryimage
      otherimages
      model
      manufacturer
      quantity 
      transmission
      fueltype  
    }
  }
`;

export const GET_ALL_MANUFACTURERS = gql`
    query {
        getAllManufacturers {
            id
            name
        }
    }
`;

export const GET_MODELS_BY_MANUFACTURER = gql`
query GetModelsByManufacturer($manufacturerId: ID!) {
    getModelsByManufacturer(manufacturerId: $manufacturerId) {
        id
        name
        year
    }
}
`;