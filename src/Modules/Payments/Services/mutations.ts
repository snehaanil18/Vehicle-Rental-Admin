import { gql } from '@apollo/client';

export const GET_ALL_PAYMENTS = gql`
  query GetAllPayments {
    getAllPayments {
    id
    bookingid
    amountpaid
    status
    createdat
    }
  }
`;