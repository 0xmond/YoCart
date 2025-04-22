import * as bcrypt from 'bcrypt';

export function hash(data: string, saltOrRound: number = 10): string {
  return bcrypt.hashSync(data, saltOrRound);
}
export function compare(data: string, encrypted: string): boolean {
  return bcrypt.compareSync(data, encrypted);
}
