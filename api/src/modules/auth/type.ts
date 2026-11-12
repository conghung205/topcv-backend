import { Request } from 'express';

export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export type AccessTokenPayload = {
  sub: string;
  role: string;
};

export type AuthenticatedRequest = Request & {
  user: AccessTokenPayload;
};
