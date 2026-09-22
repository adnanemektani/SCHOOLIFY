export type Gender = "female" | "male" | "prefer-not-to-say";
export type Residence = "urban" | "rural";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  gender: Gender;
  dateOfBirth: string;
  country: string;
  region: string;
  residence: Residence;
  verified: boolean;
  verificationTokenHash?: string;
  verificationExpiresAt?: string;
  resetTokenHash?: string;
  resetExpiresAt?: string;
  createdAt: string;
};

export type PublicUser = Omit<
  User,
  "passwordHash" | "verificationTokenHash" | "verificationExpiresAt" | "resetTokenHash" | "resetExpiresAt"
>;

export function toPublicUser(user: User): PublicUser {
  const { passwordHash, verificationTokenHash, verificationExpiresAt, resetTokenHash, resetExpiresAt, ...safeUser } = user;
  void passwordHash;
  void verificationTokenHash;
  void verificationExpiresAt;
  void resetTokenHash;
  void resetExpiresAt;
  return safeUser;
}
