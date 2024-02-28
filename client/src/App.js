// import './App.scss';
import { Container} from 'react-bootstrap';
import Register from './pages/Register/Register.js';

import ApolloProvider from './pages/ApolloProvider.js';
import CheckMutationComponent from './pages/check.js';

function App() {
  return (
    <ApolloProvider>
      <Container className='pt-5'>
            <Register />
            <CheckMutationComponent/>
      </Container>
    </ApolloProvider>
  );
}

export default App;
