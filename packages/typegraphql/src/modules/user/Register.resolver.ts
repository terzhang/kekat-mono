import { Resolver, Arg, Mutation } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './RegisterInput';
import { sendConfirmationEmail } from '../../utils/sendMail';
import { confirmationUrl } from '../../utils/confirmationUrl';
import { confirmEmailPrefix } from '../../constants/redisPrefixes';
import { confirmEmailUrlPrefix } from '../../constants/urlPrefixes';

/* Resolvers */
// Providing an object type as arg to the Resolver decorator will...
// allow this class to resolve a field within that object type
// (in this case, the fullName field within User entity)
@Resolver(User)
export class RegisterResolver {
  // generate a new User modelled by the User entity
  // tells both typeGraphql and typescript that it...
  // returns a promise that gives back a User entity object
  @Mutation(() => User)
  async register(
    @Arg('data')
    { email, firstName, lastName, password }: RegisterInput
  ): Promise<User | Error> {
    // verify user don't already exist in database - checking email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      throw new Error('Account with this information already exist');

    // hash the given password
    const hashedPassword = await bcrypt.hash(password, 12);
    // create new User record
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    // send confirmation email by
    // 1. generate the confirmation email
    const url = await confirmationUrl({
      userId: user.id,
      prefix: confirmEmailPrefix,
      urlPrefix: confirmEmailUrlPrefix,
    });
    if (!url) {
      console.log('Redis could not set the confirmation token.');
      throw new Error('Server is experiencing issues. Please try again later.');
    }
    // 2. then send the email and save new user in database
    try {
      await sendConfirmationEmail(email, url);
      // return user on success
      return user;
    } catch (err) {
      console.log(err);
      // if sending the email or creating the user fails, registeration fails
      throw new Error('Registration failed. Please try again.');
    }
  }
}
