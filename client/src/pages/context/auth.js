import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useReducer } from "react";



  const initialState = {
    isAuthenticated: false,
    user: null,
  };

  const token = localStorage.getItem('token');

  if(token){
    const decodedToken = jwtDecode(token);
    const expires  = decodedToken.exp;

    const currTime = new Date()


    if(currTime.getTime()/1000 < expires){

      localStorage.removeItem('token');
      localStorage.removeItem('username');
 
    }else{
      initialState.user = decodedToken.username;
    }

  }

  function authReducer(state, action) {
    switch (action.type) {

      case "LOGIN":

        localStorage.setItem("username",action.payload.username);
        localStorage.setItem('token',action.payload.token);

        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.username,
        };

      case 'LOGOUT':
        return {
            ...state,
            isAuthenticated: false,
            user: null,
          };

        default:
            return state
    }
  }

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{state,dispatch}}>
        {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => useContext(AuthContext);
