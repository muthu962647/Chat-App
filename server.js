const { ApolloServer, gql } = require('apollo-server');
const Sequelize = require('sequelize');
const { jwtDecode } = require('jwt-decode');

const { UserInputError, AuthenticationError } = require('apollo-server')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')
const { sequelize } =require('./models')


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (context) => {

    try {

      if (!context.req.headers.authorization) {
        return
        throw new Error('Unauthenticated');
      }

      const token = context.req.headers.authorization.split('Bearer ')[1];

      const decoded = jwtDecode(token);

      return decoded


    }catch(err){

      console.log(err);
      throw new AuthenticationError("Bad Token", err);

    }

  }
});

try{
  server.listen({port: 4050}).then(({url}) => {
    console.log(`Graphql Succesful and Server ready at: ${url}`);

    sequelize.authenticate()

    .then( () => console.log('DataBase Connected'))
    .catch((err) => {

      console.log(err);

    })

  })
  
}catch(err){
  console.log(err);
}

