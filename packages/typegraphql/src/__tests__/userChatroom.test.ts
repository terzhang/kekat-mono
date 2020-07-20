import { testConnection } from '../test-utils/testConnection';
import { Connection } from 'typeorm';
import { gqlCall } from '../test-utils/gqlCall';
import faker from 'faker';
import { User } from '../entity/User';
import { ExecutionResult } from 'graphql';
import { Chatroom } from '../entity/Chatroom';

// before all resolver tests, test if it connects first
let connection: Connection;
beforeAll(async () => {
  connection = await testConnection();
});

// after testing, close the connection.
afterAll(async (done) => {
  await connection.close();
  done();
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
  mutation deleteChatroom($chatroomId: String!) {
    deleteChatroom(chatroomId: $chatroomId)
  }
`;

// ! GQL's number scalar types are called Int or Float (not Number)
// ! Also please make sure it's query and not mutation next time.
// ! typegraphql generates Float! with number, I assumed it generated Int!
// Explained at https://www.typescriptlang.org/docs/handbook/basic-types.html#number
const getAllChatroomsQuery = `
query ($limit: Float!) {
  getAllChatrooms(limit: $limit) {
    id
    name
  }
}
`;

const joinChatroom = `
mutation joinChatroom ($chatroomId: String!) {
  joinChatroom (chatroomId: $chatroomId) {
    id
    name
  }
}
`;

describe('The User to Chatroom relationship works', () => {
  let newUserId: string;
  let newChatroomId: string;
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
    newUserId = newUser.id; // store user id

    const newRoomName = faker.name.firstName();
    // make new chatroom with yourself in it
    const creationResponse = await gqlCall({
      source: createRoomWithSelfMutation,
      userId: newUserId,
      variableValues: { roomName: newRoomName },
    });
    // successful creation of chatroom with self as user
    expect(creationResponse.data!).toBeDefined();
    // get back the same name created with
    expect(creationResponse.data!.createChatroomWithUser.name).toBe(
      newRoomName
    );
    // keep the new room id
    newChatroomId = creationResponse.data!.createChatroomWithUser.id;

    const responseWithChatrooms = await gqlCall({
      source: getMeWithMyChatroomsQuery,
      userId: newUserId,
    });
    // the associated chatrooms should show up as a field when queried
    expect(responseWithChatrooms.data!.getMe.chatrooms).toBeDefined();
    // the first chatroom in the list match the room name with the one we've created
    expect(responseWithChatrooms.data!.getMe.chatrooms[0].name).toBe(
      newRoomName
    );
  });

  it('delete chatroom', async () => {
    // deleting room should be successful
    const deleteResponse = (await gqlCall({
      source: deleteRoomMutation,
      userId: newUserId,
      variableValues: { chatroomId: newChatroomId },
    })) as ExecutionResult;
    // should get back the deleted room id
    expect(deleteResponse.data).toMatchObject({
      deleteChatroom: newChatroomId,
    });

    // chatroom should not exist anymore
    const noChatroomResponse = await gqlCall({
      source: getMeWithMyChatroomsQuery,
      userId: newUserId,
    });
    // the associated chatroom to the new user should be empty
    // ? toEqual checks type and inner content, toBe checks reference
    expect(noChatroomResponse.data!.getMe.chatrooms).toEqual([]);
  });

  it('user can self join chatroom', async () => {
    const anotherName = faker.company.catchPhrase();
    // make a new chatroom with random name to attempt to join it
    const anotherChatroom = await Chatroom.create({
      name: anotherName,
    }).save();
    const response = await gqlCall({
      source: joinChatroom,
      userId: newUserId, // need to authenticate
      variableValues: { chatroomId: anotherChatroom.id },
    });
    expect(response.data!.joinChatroom).toMatchObject({
      id: anotherChatroom.id,
      name: anotherName,
    });
  });

  it('retrieves chatroom properly', async () => {
    const limit = 5;
    const response = await gqlCall({
      source: getAllChatroomsQuery,
      variableValues: { limit },
    });
    // at most 5 chatrooms
    expect(response.data!.getAllChatrooms.length).toBeLessThanOrEqual(limit);
    const propertiesOfChatroom = ['id', 'name'];
    // contains an array of Chatrooms
    for (let chatroom of response.data!.getAllChatrooms) {
      for (let property of propertiesOfChatroom) {
        // each entry in the array has all the property of Chatroom
        expect(chatroom).toHaveProperty(property);
      }
    }
  });
});
