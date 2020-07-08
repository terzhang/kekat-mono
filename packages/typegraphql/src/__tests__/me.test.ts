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

const getMeQuery = `
{
  getMe {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe('Me resolver works', () => {
  it('gives back correct self information', async () => {
    const userInfo = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    // make a new user
    const newUser = await User.create(userInfo);
    // ! Note to self: save() is async so remember to put await before it
    await newUser.save(); // then save it in database
    // Make a me query
    const response = await gqlCall({
      source: getMeQuery,
      userId: newUser.id, // pass user.id to be manually put into session
    });

    // assert the response to give back the requested data
    expect(response.data).toMatchObject({
      getMe: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  });

  it('gives back null on invalid call', async () => {
    // querying getMe resolver without user id
    const response = await gqlCall({
      source: getMeQuery,
    });
    // should get response data with getMe field as null
    expect(response.data!.getMe).toBeNull();
  });
});
