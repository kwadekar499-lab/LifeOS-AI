/**
 * Role enumeration for future RBAC.
 * Currently only USER is used.
 * Design prepared for future ADMIN, TEAM_ADMIN, MEMBER, READ_ONLY roles.
 */
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TEAM_ADMIN = 'TEAM_ADMIN',
  MEMBER = 'MEMBER',
  READ_ONLY = 'READ_ONLY',
}
