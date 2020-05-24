import { Resolver, Arg, Mutation } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './RegisterInput';
import { sendMail } from '../../utils/sendMail';
import { confirmationUrl } from '../../utils/confirmationUrl';
import { confirmEmailPrefix } from '../../constants/redisPrefixes';

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
  ): Promise<User | null> {
    // TODO: return error if user creation fail
    // hash the given password
    const hashedPassword = await bcrypt.hash(password, 12);
    // create new User entity
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // send confirmation email by
    // 1. generate the confirmation email
    const url = await confirmationUrl({
      userId: String(user.id),
      prefix: confirmEmailPrefix,
      urlPrefix: 'http://localhost:9999/user/confirm-email/',
    });
    // 2. then send the email
    try {
      await sendMail(email, url);
      await user.save(); // save the user in database after send email since email can be invalid or fail to send
    } catch (err) {
      // if sending the email or creating the user fails, registeration fails
      return null;
    }

    return user;
  }
}
