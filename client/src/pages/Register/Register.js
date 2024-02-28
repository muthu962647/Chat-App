import React from 'react'
import { useState } from 'react'
import { gql, useMutation } from '@apollo/client';
import './Register.css'

function Register() {

  const [variables, setVariables] = useState({

    username: '', 
    email : '',
    password : '',
    confirmPassword: ''

  });

  const [errors, setErrors] = useState({})


  const Register_User = gql`
    mutation Register($input: CreateUserInput) {

      register(input: $input) {
        email
      }
    }
`;


  const [createUser, {data, loading, error }] = useMutation(Register_User, {
    update(_,res){
      console.log(res)
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions);
      console.log(errors);
    }
  });

  const ChangeHandler = (e) => {
    setVariables(
      {
        ...variables,
        [e.target.name] : e.target.value
      }
    )
  }

  const SubmitHandler = async(e) => {

    e.preventDefault();

    try {
      console.log(variables);
      const { data } = await createUser({
        variables: {
          input: variables
        }
      });



      console.log(data);
    } catch (error) {
      console.error(error);
    }

   

  }

  return (
    <>
    <div className="form-container">

      <form>
        <label htmlFor="name"><b>Name</b></label>
        <input type="text" name="username" onChange={ChangeHandler} placeholder='Enter your Name Here' required/>
        <label htmlFor="email" ><b>Email</b></label>
        <input type="email" name="email" onChange={ChangeHandler} placeholder='Enter Email' required/>
        <label htmlFor="password"><b>Password</b></label>
        <input type="password" name="password" onChange={ChangeHandler} placeholder='Enter password' required/>
        <label htmlFor="confirmPassword"><b>Confirm Password</b></label>
        <input type="text" name="confirmPassword" onChange={ChangeHandler} placeholder='Confirm Password' required/>

        {loading? 'loading ...' : <button type='submit' className = "registerbtn" onClick={SubmitHandler}>Register</button>} 
      </form>
      </div>
    </>
  )
}

export default Register