import { testConnection } from '../test-utils/testConnection';
import { Connection } from 'typeorm';
import { gqlCall } from '../test-utils/gqlCall';
import faker from 'faker';
import { User } from '../entity/User';

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
mutation register ($data: RegisterInput!) {
  register (data: $data) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe('register resolver works', () => {
  /** the register resolver works when calling mutation w/ graphQL */
  it('registers properly', async () => {
    // this is basically register input defined in RegisterInput.ts
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    // call mutation with graphQL and assert the response back
    const response = await gqlCall({
      source: testRegisterMutation,
      variableValues: { data: user },
    });
    // response object should match the expected object
    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });

    // user entity can be found in the database
    const dbUser = await User.findOne({ where: { email: user.email } });
    // user is defined
    expect(dbUser).toBeDefined();
    // their confirmed field to be false
    expect(dbUser!.confirmed).toBeFalsy();
  });
});
