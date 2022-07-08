import { randomUUID } from 'crypto';

export const jwtConstants = {
  secret: randomUUID().toString(),
};
