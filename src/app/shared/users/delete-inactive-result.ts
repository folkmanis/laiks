export interface DeleteInactiveUsersResult {
  inactiveDays: number;
  inactiveUsers: string[];
  results: unknown[];
  errors: Error[];
}
