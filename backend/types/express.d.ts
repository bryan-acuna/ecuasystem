import 'express';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
