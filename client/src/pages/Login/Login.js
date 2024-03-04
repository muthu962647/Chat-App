import React, {useState} from 'react'
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';


function Login() {

    const [variables, setVariables] = useState({

        username: '', 
        password : ''
    
      });

    const { state, dispatch } = useAuth();

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const Login_User = gql`
        query login($input: LoginCredentials){
            login(input: $input){
                token
                username
            }
        }
    `;

    const [LoginUser, {data, loading, error}] = useLazyQuery(Login_User, {

        onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
        onCompleted(data){
         
            dispatch({ type : 'LOGIN', payload: data.login});
            navigate('/home')
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
          const { data } = await LoginUser({
            variables: {
              input: variables
            }
          });
          
        } catch (error) {
          console.error(error);
        }
      }

  return (
    <div className="form-container">
        <form >
            <h1>Login</h1>
        <label htmlFor="name"><b>UserName</b></label>
        <input type="text" name="username" onChange={ChangeHandler} placeholder='Enter your Name Here' required/>
        <label htmlFor="password"><b>Password</b></label>
        <input type="password" name="password" onChange={ChangeHandler} placeholder='Enter password' required/>

        
        {loading? 'loading ...' : <button type='submit' className = "registerbtn" onClick={SubmitHandler}>Login</button>} 

        <small>Don't have an Account? <Link to="/register">Register</Link> here</small>

        </form>
    </div>
  )
}

export default Login