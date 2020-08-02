import DataLoader from 'dataloader';
import { User } from '../entity/User';
import { UserChatroom } from '../entity/UserChatroom';
import { In } from 'typeorm';
import { Chatroom } from '../entity/Chatroom';
import { Message } from '../entity/Message';

type user_chatroom = {
  id: string;
  userId: string;
  chatroomId: string;
  user?: User | undefined; // this is missing from declaration with .find({...})
  chatroom?: Chatroom | undefined; // also missing
};

/**
 * Batch all the corresponding users to a chatroom id.
 * Do this for each chatroom id in the given chatroomIds array and return it as an array of User[]
 * But each User[] entry must have the same index...
 * ...as their corresponding chatroom id in the given chatroomIds array.
 * This is for later look up when loading users that belong to a specific chatroom
 * usersOfChatroomLoader.load(chatroomId) ===> returns User[]
 */
async function batchUsersOfChatroom(
  chatroomIds: readonly string[]
): Promise<User[][]> {
  // get all user_chatroom columns/records from the UserChatroom join table entity
  const user_chatroomArray: user_chatroom[] = await UserChatroom.find({
    // that has a chatroomId that belong in the given chatroomIds array
    where: {
      chatroomId: In(chatroomIds as string[]),
    },
    // also get the "user" column that has a relation to it (M:M).
    join: {
      alias: 'user_chatroom', // alias for the main entity (not the joining entity)
      innerJoinAndSelect: {
        user: 'user_chatroom.user', // INNER JOIN User user ON where user.id = user_chatroom.user
      },
    },
  });
  /* Each entry/column in user_chatroomArray looks like this:
  {
    id: 'j81bc', userId: 'a14cf', chatroomId: 'j8ur2', user: User
  }
  */

  // As noting in the README of dataload, there are 2 constraints:
  // 1. The Array of values must be the same length as the Array of keys. (Check)
  // 2. Each index in the Array of values must correspond to the same index in the Array of keys (X)

  // To return each user_chatroom entry in the same index as the given chatroomIds array
  // Do this by map "all the users that belongs to the same chatroom"(Users[])
  // to their corresponding chatroomId for easy look up by key
  // that means we want this:
  // { 'a14cf' : [...Users1], 'b31k9': [...Users2], ...}
  type usersMappedByChatroomId = {
    [key: string]: User[];
  };
  const mappedUsers: usersMappedByChatroomId = {};

  // loop through each entry in user_chatroomArray
  for (let index = 0; index < user_chatroomArray.length; index++) {
    // current entry in user_chatroomArray
    const user_chatroomEntry: user_chatroom = user_chatroomArray[index];
    const { chatroomId } = user_chatroomEntry; // get chatroomId
    const user: User | undefined = user_chatroomEntry.user; // get user
    // before stuffing each chatroomId as key with user as value
    // check if chatroomId is already a key in our mappedUser object
    if (mappedUsers[chatroomId]) {
      // if key already in there, add user to the list
      mappedUsers[chatroomId].push(user!);
    } else {
      // otherwise, add this user to existing User[]
      mappedUsers[chatroomId] = [user!];
    }
  }
  // map through given chatroomIds array and return each chatroom id's corresponding User[]
  // so it follows the order of the given chatroomIds
  return chatroomIds.map((chatroomId) => mappedUsers[chatroomId]);
}

/** For each userId in the given userIds,
 * batch all the chatrooms that corresponds to a user */
async function batchChatroomsOfUser(
  userIds: readonly string[]
): Promise<Chatroom[][]> {
  // get all user_chatroom columns/records from the UserChatroom join table entity
  const user_chatroomArray: user_chatroom[] = await UserChatroom.find({
    // that has a userId that belong in the given userIds array
    where: {
      userId: In(userIds as string[]),
    },
    // also get the "chatroom" column that has a relation to it (M:M).
    join: {
      alias: 'user_chatroom',
      innerJoinAndSelect: {
        chatroom: 'user_chatroom.chatroom',
      },
    },
  });
  /* Each entry/column in user_chatroomArray looks like this:
  {
    id: 'j18bc', userId: 'a14cf', chatroomId: 'j8ur2', chatroom: Chatroom
  }
  */

  // As noting in the README of dataload, there are 2 constraints:
  // 1. The Array of values must be the same length as the Array of keys. (Check)
  // 2. Each index in the Array of values must correspond to the same index in the Array of keys (X)

  // To return each user_chatroom entry in the same index as the given chatroomIds array
  // Do this by map "all the users that belongs to the same chatroom"(Users[])
  // to their corresponding chatroomId for easy look up by key
  // that means we want this:
  // { 'a14cf' : [...Users1], 'b31k9': [...Users2], ...}
  type usersMappedByChatroomId = {
    [key: string]: Chatroom[];
  };
  const mappedUsers: usersMappedByChatroomId = {};

  // loop through each entry in the user_chatroom table
  for (let index = 0; index < user_chatroomArray.length; index++) {
    // get user id and chatroom from the record at this index within the user_chatroom table
    const { userId, chatroom } = user_chatroomArray[index];
    // before stuffing each chatroomId as key with chatroom as value
    // check if userId is already a key in our mappedUser object
    if (mappedUsers[userId]) {
      // if key already in there, add user to the list
      mappedUsers[userId].push(chatroom!);
    } else {
      // otherwise, add this user to existing User[]
      mappedUsers[userId] = [chatroom!];
    }
  }
  // map through given chatroomIds array and return each chatroom id's corresponding User[]
  // so it follows the order of the given chatroomIds
  return userIds.map((userId) => mappedUsers[userId]);
}

async function batchMessagesOfChatroom(
  chatroomIds: readonly string[]
): Promise<Message[][]> {
  // get a chatrooms for each chatroomId in the given chatroomIds array
  const chatrooms: Chatroom[] = await Chatroom.findByIds(
    chatroomIds as string[]
  );

  type mappedMessages = {
    [key: string]: Message[];
  };

  const messagesMappedByChatroomId: mappedMessages = {};
  // for each chatroom in Chatroom[], map its own id as key to its own messages (Message[])
  for (let i in chatrooms) {
    const chatroom = chatrooms[i];
    const chatroomId = chatroom.id;
    messagesMappedByChatroomId[chatroomId] = chatroom.messages;
  }

  // return the messagesMappedByChatroomId as an array ordered by the chatroomIds array
  return chatroomIds.map(
    (chatroomId) => messagesMappedByChatroomId[chatroomId]
  );
}

// every request a new data loader object is created
export const usersOfChatroomLoader = () =>
  new DataLoader<string, User[]>(batchUsersOfChatroom);
export const chatroomsOfUserLoader = () =>
  new DataLoader<string, Chatroom[]>(batchChatroomsOfUser);
export const messagesOfChatroomLoader = () =>
  new DataLoader<string, Message[]>(batchMessagesOfChatroom);
