export interface Permissions {
  admin: boolean;
  npUser: boolean;
  npBlocked: boolean;
}

export const DEFAULT_PERMISSIONS: Permissions = {
  admin: false,
  npUser: false,
  npBlocked: false,
};
