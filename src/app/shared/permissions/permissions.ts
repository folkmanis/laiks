export interface Permissions {
  admin: boolean;
  npBlocked: boolean;
}

export const DEFAULT_PERMISSIONS: Permissions = {
  admin: false,
  npBlocked: false,
};
