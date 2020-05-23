import { Resolver, Arg, Mutation } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './RegisterInput';
import { sendMail } from '../../utils/sendMail';
import { confirmationUrl } from '../../utils/confirmationUrl';

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
  ): Promise<User> {
    // hash the given password
    const hashedPassword = await bcrypt.hash(password, 12);
    // create new User in database and save it
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    // send confirmation email by
    // 1. generate the confirmation email
    const url = await confirmationUrl(String(user.id));
    // 2. then send the email
    await sendMail(email, url);

    return user;
  }
}
