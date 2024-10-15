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
    $images: [Upload]!,
    $primaryimageindex: Int!,
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
      images: $images,
      primaryimageindex: $primaryimageindex,
      quantity: $quantity
    ) {
      id
      name
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

export const UPDATE_VEHICLE = gql`
mutation UpdateVehicle(
  $id: ID!
  $name: String
  $description: String
  $price: Float
  $quantity: Int!
) {
  updateVehicle(
    id: $id
    name: $name
    description: $description
    price: $price
    quantity: $quantity
  ) {
    success
    message
    vehicle {
      id
      name
      description
      price
      quantity
    
    }
  }
}
`;

export const UPDATE_VEHICLE_IMAGES = gql`
  mutation UpdateVehicleImages($id: ID!, $images:[CombinedImageInput!]!) {
    updateVehicleImages(id: $id, images: $images) {
      message
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;