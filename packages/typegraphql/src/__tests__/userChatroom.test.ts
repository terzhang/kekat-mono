import { testConnection } from '../test-utils/testConnection';
import { Connection } from 'typeorm';
import { gqlCall } from '../test-utils/gqlCall';
import faker from 'faker';
import { User } from '../entity/User';
import { ExecutionResult } from 'graphql';

// before all resolver tests, test if it connects first
let connection: Connection;
beforeAll(async () => {
  connection = await testConnection();
});

// after testing, close the connection.
afterAll(async () => {
  await connection.close();
});

const createRoomWithSelfMutation = `
mutation createChatroomWithUser ($roomName: String!) {
  createChatroomWithUser (roomName: $roomName) {
    id
    name
  }
}
`;

const getMeWithMyChatroomsQuery = `
{
  getMe {
    id
    firstName
    lastName
    email
    name
    chatrooms {
      id
      name
    }
  }
}
`;

const deleteRoomMutation = `
mutation deleteChatroom ($id: String!) {
  deleteChatroom (id: $id)
}
`;

/* const getChatroomsQuery = `
query getChatrooms {
  getChatrooms(limit: 5) {
      id
      name
  }
}
`; */

describe('The User to Chatroom relationship works', () => {
  it('create and join room properly', async () => {
    const userInfo = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    // make a new user
    // ! please remember to save() the user record after create()
    // make it confirmed to skip the confirmation email
    const newUser = await User.create({ ...userInfo, confirmed: true }).save();

    const newRoomName = faker.name.firstName();
    // make new chatroom with yourself in it
    const creationResponse = await gqlCall({
      source: createRoomWithSelfMutation,
      userId: newUser.id,
      variableValues: { roomName: newRoomName },
    });
    // successful creation of chatroom with self as user
    expect(creationResponse.data!).toBeDefined();
    // get back the same name created with
    expect(creationResponse.data!.createChatroomWithUser.name).toBe(
      newRoomName
    );
    // keep the new room id
    const newChatroomId = creationResponse.data!.createChatroomWithUser.id;

    const responseWithChatrooms = await gqlCall({
      source: getMeWithMyChatroomsQuery,
      userId: newUser.id,
    });
    // the associated chatrooms should show up as a field when queried
    expect(responseWithChatrooms.data!.getMe.chatrooms).toBeDefined();
    // the first chatroom in the list match the room name with the one we've created
    expect(responseWithChatrooms.data!.getMe.chatrooms[0].name).toBe(
      newRoomName
    );

    // deleting room should be successful
    const deleteResponse = (await gqlCall({
      source: deleteRoomMutation,
      userId: newUser.id,
      variableValues: { id: newChatroomId },
    })) as ExecutionResult;
    // should get back the deleted room id
    expect(deleteResponse.data).toMatchObject({
      deleteChatroom: newChatroomId,
    });

    // chatroom should not exist anymore
    const noChatroomResponse = await gqlCall({
      source: getMeWithMyChatroomsQuery,
      userId: newUser.id,
    });
    // the associated chatroom to the new user should be empty
    // ? toEqual checks type and inner content, toBe checks reference
    expect(noChatroomResponse.data!.getMe.chatrooms).toEqual([]);
  });
});
