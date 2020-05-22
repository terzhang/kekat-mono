input LoginInput {
  email: String!
  password: String!
}

type Mutation {
  register(data: RegisterInput!): User!
  login(data: LoginInput!): User
}

type Query {
  getUser(id: String!): String!
  getMe: User
}

input RegisterInput {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
}

type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  name: String!
}

