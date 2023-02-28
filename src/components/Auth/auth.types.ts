export enum Errors {
  EMAIL_NOT_FOUND = "auth/user-not-found",
  INVALID_PASSWORD = "auth/wrong-password",
  WEAK_PASSWORD = "auth/weak-password",
  INVALID_EMAIL = "auth/invalid-email",
  EMAIL_EXISTS = "auth/email-already-in-use",
};

export type Inputs = {
  email: string;
  password: string;
};

