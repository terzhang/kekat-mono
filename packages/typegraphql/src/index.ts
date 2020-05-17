import { ApolloServer } from 'apollo-server-express';
import * as Express from 'express';
import {
  Resolver,
  buildSchema,
  Query,
  ObjectType,
  Field,
  Arg,
  ID,
  Args,
  Mutation,
  Ctx,
  InputType,
  ArgsType,
  Int,
} from 'type-graphql';
import 'reflect-metadata';
import { MaxLength, Length, ArrayMaxSize, Min, Max } from 'class-validator';
import { RecipeService, User } from './types/recipe';
// import { RecipeNotFoundError } from './errors';
import { createConnection } from 'typeorm';
const PORT = 9000;

/* define Inputs to compose a new recipe */
@InputType()
class NewRecipeInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @Length(30, 255)
  description?: string;

  @Field((type) => [String])
  @ArrayMaxSize(30)
  ingredients: string[];
}

/* define Arguments for recipe */
@ArgsType()
class RecipesArgs {
  @Field((type) => Int)
  @Min(0)
  skip: number = 0; // default 0

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  take: number = 25; // default 25
}

// this is what gets passed around
@ObjectType()
class Recipe {
  @Field((type) => ID)
  id?: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate: Date;

  @Field((type) => [String])
  ingredients: string[];
}

// use this for now
const newRecipe = (id: string): Recipe => ({
  title: 'Teriyaki' + id,
  description: 'quite yummy!',
  creationDate: new Date(),
  ingredients: [
    'not terry',
    'chicken',
    'sauce',
    'love',
    'water',
    'salt',
    'more sauce',
  ],
});

/* Resolvers */
@Resolver(Recipe)
class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  // GET request for a recipe via id
  @Query(() => String, { name: 'getOneRecipe' }) // assign a name for the query must be camelCase
  async recipe(@Arg('id') id: string) {
    return 'recipe' + id; //newRecipe(id);
    // const recipe = await this.recipeService.findById(id);
    // if (recipe === undefined) {
    //   RecipeNotFoundError(id);
    // }
    // return recipe;
  }

  /* @Query(() => [Recipe], { name: 'getManyRecipes' })
  recipes(@Args() { skip, take }: RecipesArgs) {
    // return this.recipeService.findAll({ skip, take });
    return [];
  }

  // add a new recipe given newRecipeData and return it as a promise
  @Mutation(() => Recipe, { name: 'addOneRecipe' })
  // @Authorized() // access for authorized users only
  addRecipe(
    @Arg('newRecipeData') newRecipeData: NewRecipeInput,
    @Ctx('user') user: User
  ): Promise<Recipe> {
    return this.recipeService.addNew({ data: newRecipeData, user });
  }

  // remove a recipe by given id and return whether it was successful
  @Mutation(() => Boolean, { name: 'removeOneRecipe' })
  // @Authorized(Roles.Admin)
  async removeRecipe(@Arg('id') id: string) {
    try {
      await this.recipeService.removeById(id);
      return true;
    } catch {
      return false;
    }
  } */
}

// this make it start async'ly
const main = async () => {
  // https://typeorm.io/#/connection/creating-a-new-connection
  // this read from orm config to make a connection to database
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  const apolloServer = new ApolloServer({ schema });
  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log('server started on http://localhost:' + PORT + '/graphql');
  });
};

// start it
main();
