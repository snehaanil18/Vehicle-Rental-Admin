import { gql } from '@apollo/client';

export const GET_ALL_MANUFACTURERS = gql`
    query {
        getAllManufacturers {
            id
            name
        }
    }
`;

export const GET_MODELS_BY_MANUFACTURER = gql`
query GetModelsByManufacturer($manufacturerid: ID!) {
    getModelsByManufacturer(manufacturerid: $manufacturerid) {
        id
        name
        year
    }
}
`;

export const ADD_MANUFACTURER = gql`
    mutation AddManufacturer($name: String!) {
        addManufacturer(name: $name) {
            id
            name
        }
    }
`;

export const GET_ALL_MODELS = gql`
    query {
        getAllModels {
            id
            manufacturerid
            name
            year
        }
    }
`;

export const ADD_MODEL = gql`
    mutation AddModel($name: String!, $year: Int!, $manufacturerid: ID!) {
        addModel(name: $name, year: $year, manufacturerid: $manufacturerid) {
            id
            name
            year
            manufacturerid 
        }
    }
`;