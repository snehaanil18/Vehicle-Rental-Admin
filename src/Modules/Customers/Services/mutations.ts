import { gql } from '@apollo/client';

export const GET_ALL_BOOKINGS_QUERY = gql`
  query GetAllBookings {
    getAllBookings {
      id
      vehiclename
      pickupdate
      dropoffdate
      totalamount
      username
      paymentstatus
    }
  }
`;