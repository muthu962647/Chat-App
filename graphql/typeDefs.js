const { gql } = require('apollo-server');

module.exports = gql`

  type User {

    username: String!
    email: String!
    token: String
    imageUrl: String
    createdAt: String
    latestMessage: Message

  }

  type Message {
    uuid: String!,
    content: String!,
    from: String!,
    to: String!
    createdAt: String!
  }

  type Query{

    getUsers: [User]

    login(input: LoginCredentials): User!

    getMessage(to: String!): [Message]
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input LoginCredentials {
    username: String!,
    password: String!
  }

  type CheckResponse {
  name: String!
  }

  type Mutation{
    register(input: CreateUserInput): User!
    check(name: String!): CheckResponse!
    sendMessage(to: String!, content: String!): Message!
  }

  

`;