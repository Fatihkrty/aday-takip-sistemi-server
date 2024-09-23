import * as bcrpyt from 'bcrypt';

export async function comparePassword(password: string, encrypted: string) {
  return bcrpyt.compare(password, encrypted);
}

export async function hashPassword(password: string) {
  const salt = await bcrpyt.genSalt(10);
  return bcrpyt.hash(password, salt);
}
