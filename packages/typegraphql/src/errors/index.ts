export function RecipeNotFoundError(id: string): Error {
  return new Error('the recipe with the id: ' + id + 'is not found');
}
