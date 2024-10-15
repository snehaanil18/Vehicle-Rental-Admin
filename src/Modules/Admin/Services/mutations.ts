import gql from 'graphql-tag'

export const SEARCH_VEHICLES = gql`
query SearchVehicles($query: String!) {
  searchVehicles(query: $query) {
    id
    name
    description
    price
    model
    manufacturer
    primaryimage
    vehicletype
    quantity
    transmission
    fueltype
  }
}
`;