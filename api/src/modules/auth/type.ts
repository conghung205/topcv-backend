import { Request } from 'express';

export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export type AccessTokenPayload = {
  sub: string;
  role: Role;
};

export type AuthenticatedRequest = Request & {
  user: AccessTokenPayload;
};
