import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

function CheckMutationComponent() {
  const [name, setName] = useState('');
  
  // Define the mutation operation
  const CHECK_MUTATION = gql`
    mutation Check($name: String!) {
      check(name: $name) {
        name
      }
    }
  `;
  
  // Use the useMutation hook to execute the mutation
  const [check, { data, loading, error }] = useMutation(CHECK_MUTATION);
  
  // Handler function to call the mutation
  const handleCheck = async () => {
    try {
      // Call the mutation function with the name variable
      const result = await check({ variables: { name } });
      console.log(result.data.check); // Log the response data
    } catch (error) {
      console.error(error); // Log any errors that occur
    }
  };
  
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={handleCheck}>Check</button>
    </div>
  );
}

export default CheckMutationComponent;
