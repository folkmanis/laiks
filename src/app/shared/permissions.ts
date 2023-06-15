export interface Permissions {
    admin: boolean,
    npUser: boolean,
}

export const DEFAULT_PERMISSIONS: Permissions = {
    admin: false,
    npUser: false,
};