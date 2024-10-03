import { ApolloClient, InMemoryCache } from '@apollo/client';
// @ts-expect-error - TypeScript doesn't have type definitions for this module
import { createUploadLink } from 'apollo-upload-client';

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
});

// Create the Apollo Client
const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});

export default client;