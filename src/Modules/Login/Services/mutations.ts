import { gql } from '@apollo/client';

export const LOGIN_ADMIN_MUTATION = gql`
mutation LoginUser($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
    success
    message
    token
  }
}
`;