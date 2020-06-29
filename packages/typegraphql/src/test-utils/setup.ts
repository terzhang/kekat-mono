import { testConnection } from './testConnection';

// test the connection as a promise then close node when it's done
testConnection(true).then(() => process.exit());
