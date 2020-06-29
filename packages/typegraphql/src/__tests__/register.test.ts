import { testConnection } from '../test-utils/testConnection';
import { Connection } from 'typeorm';
import { gqlCall } from '../test-utils/gqlCall';

// before all resolver tests, test if it connects first
let connection: Connection;
beforeAll(async () => {
  connection = await testConnection();
});

// after testing, close the connection.
afterAll(async () => {
  await connection.close();
});

// create a register mutation that defines the shape of the response you want back
// we use it to agnostically test the GraphQL backend
const testRegisterMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe('resolvers work', () => {
  /** the register resolver works when calling mutation w/ graphQL */
  it('registers', async () => {
    // this is basically register input defined in RegisterInput.ts
    const variableValues = {
      data: {
        firstName: 'testFirst',
        lastName: 'testLast',
        email: 'test@test.com',
        password: 'test123',
      },
    };
    // call mutation with graphQL and assert the response back
    const response = await gqlCall({
      source: testRegisterMutation,
      variableValues,
    });
    console.log(response);
  });
});
