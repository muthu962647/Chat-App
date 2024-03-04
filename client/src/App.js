import { Container} from 'react-bootstrap';
import {Routes, Route} from 'react-router-dom'

import Register from './pages/Register/Register.js';
import Login from './pages/Login/Login.js';
import ApolloProvider from './pages/ApolloProvider.js';
import { AuthProvider } from './pages/context/auth.js';
import { Navigation } from './pages/Navigation/Navigation.js';
import './App.css'
import Home from './pages/Home/Home.js';


function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <Container className='pt-5'>
          <Navigation/>
          <Routes>
            <Route path = '/'  element= {<Register/>}/>
            <Route path = '/register'  element= {<Register/>}/>
            <Route path = '/login'  element= {<Login/>}/>
            <Route path = '/home' element = {<Home/>}/>
          </Routes>
        </Container>
        </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
