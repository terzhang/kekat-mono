/** takes the authorization header can verify it's valid */
export const verifyBearer = (bearer: string): string | null => {
  const reg = /^bearer\s(.*)$/i;
  // Regex to check it's in the right format of "Bearer ad281e..."
  if (!/^bearer\s.*$/i.test(bearer)) {
    throw new Error('Incorrect JWT format');
  }
  const token = reg.exec(bearer)![1];
  return token;
};
