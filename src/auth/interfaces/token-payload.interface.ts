export interface TokenPayload {
  userId: number;
  username: string;
  userRoles: {
    userRoleNames: string[];
    userRoleCodes: number[];
  };
  uuid: string;
}
